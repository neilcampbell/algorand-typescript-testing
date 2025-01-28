import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Config, microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import type { SendAppTransactionResult } from '@algorandfoundation/algokit-utils/types/app'
import type { Arc56Contract } from '@algorandfoundation/algokit-utils/types/app-arc56'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppFactory, AppFactoryDeployParams } from '@algorandfoundation/algokit-utils/types/app-factory'
import type { AssetCreateParams } from '@algorandfoundation/algokit-utils/types/composer'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import { encodingUtil } from '@algorandfoundation/puya-ts'
import type { Use } from '@vitest/runner/types'
import { OnApplicationComplete } from 'algosdk'
import fs from 'fs'
import path from 'path'
import type { ExpectStatic } from 'vitest'
import { test } from 'vitest'
import type { DeliberateAny } from '../src/typescript-helpers'
import { invariant } from './util'

const algorandTestFixture = (localnetFixture: AlgorandFixture) =>
  test.extend<{
    localnet: AlgorandFixture
    algorand: AlgorandClient
    testAccount: AlgorandFixture['context']['testAccount']
    assetFactory: (assetCreateParams: AssetCreateParams) => Promise<bigint>
  }>({
    localnet: async ({ expect: _expect }, use) => {
      await use(localnetFixture)
    },
    testAccount: async ({ localnet }, use) => {
      await use(localnet.context.testAccount)
    },
    algorand: async ({ localnet }, use) => {
      await use(localnet.context.algorand)
    },
    assetFactory: async ({ localnet }, use) => {
      use(async (assetCreateParams: AssetCreateParams) => {
        const { assetId } = await localnet.algorand.send.assetCreate(assetCreateParams)
        return assetId
      })
    },
  })

function createLazyLoader(path: string) {
  let result: Arc56Contract[] | undefined = undefined
  return {
    getResult() {
      if (!result) result = loadFromPath(path)
      return result
    },
  }
}
type AlgoClientAppCallParams = Parameters<AlgorandClient['send']['appCall']>[0]

type ProgramInvokeOptions = {
  appId?: bigint
  sender?: AlgoClientAppCallParams['sender']
  approvalProgram?: Uint8Array

  clearStateProgram?: Uint8Array
  onComplete?:
    | OnApplicationComplete.NoOpOC
    | OnApplicationComplete.OptInOC
    | OnApplicationComplete.CloseOutOC
    | OnApplicationComplete.ClearStateOC
    | OnApplicationComplete.UpdateApplicationOC
    | OnApplicationComplete.DeleteApplicationOC
  schema?: {
    /** The number of integers saved in global state. */
    globalInts?: number
    /** The number of byte slices saved in global state. */
    globalByteSlices?: number
    /** The number of integers saved in local state. */
    localInts?: number
    /** The number of byte slices saved in local state. */
    localByteSlices?: number
  }
} & Omit<AlgoClientAppCallParams, 'onComplete' | 'sender' | 'appId'>

type ProgramInvoker = {
  send(options?: ProgramInvokeOptions): Promise<SendAppTransactionResult>
}

type BaseFixtureContextFor<T extends string> = {
  [key in T as `${key}Invoker`]: ProgramInvoker
}
export function createBaseTestFixture<TContracts extends string = ''>(path: string, contracts: TContracts[]) {
  const lazyLoad = createLazyLoader(path)
  const localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  Config.configure({
    logger: nullLogger,
  })

  function getAppSpec(expect: ExpectStatic, contractName: string) {
    const appSpec = lazyLoad.getResult().find((s) => s.name === contractName)
    if (appSpec === undefined) {
      expect.fail(`${path} does not contain an ARC4 contract "${contractName}"`)
    } else {
      return appSpec
    }
  }

  const ctx: DeliberateAny = {}
  for (const contractName of contracts) {
    ctx[`${contractName}Invoker`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<ProgramInvoker>,
    ) => {
      const appSpec = getAppSpec(expect, contractName)

      const approvalProgram = encodingUtil.base64ToUint8Array(appSpec.source!.approval)
      const clearStateProgram = encodingUtil.base64ToUint8Array(appSpec.source!.clear)
      invariant(approvalProgram, `No approval program found for ${contractName}`)
      invariant(clearStateProgram, `No clear state program found for ${contractName}`)

      use({
        async send(options?: ProgramInvokeOptions) {
          const common = {
            ...options,
            appId: options?.appId ?? 0n,
            onComplete: options?.onComplete ?? OnApplicationComplete.NoOpOC,
            sender: options?.sender ?? localnet.context.testAccount.addr,
          }
          if (common.appId === 0n || common.onComplete === OnApplicationComplete.UpdateApplicationOC) {
            common.approvalProgram = approvalProgram
            common.clearStateProgram = clearStateProgram
          }
          const group = localnet.algorand.send.newGroup()
          group.addAppCall(common as DeliberateAny)

          // TODO: Add simulate call to gather trace

          const result = await group.send()
          return {
            ...result,
            confirmation: result.confirmations[0],
            transaction: result.transactions[0],
          }
        },
      })
    }
  }
  const extendedTest = algorandTestFixture(localnet).extend<BaseFixtureContextFor<TContracts>>(ctx)
  return [extendedTest, localnet] as readonly [typeof extendedTest, AlgorandFixture]
}

type Arc4FixtureContextFor<T extends string> = {
  [key in T as `appFactory${key}`]: AppFactory
} & {
  [key in T as `appClient${key}`]: AppClient
} & {
  [key in T as `appSpec${key}`]: Arc56Contract
}

type ContractConfig = {
  deployParams?: AppFactoryDeployParams
}

export function createArc4TestFixture<TContracts extends string = ''>(
  path: string,
  contracts: Record<TContracts, ContractConfig> | TContracts[],
) {
  const lazyLoad = createLazyLoader(path)

  const localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  Config.configure({
    logger: nullLogger,
  })

  function getAppSpec(expect: ExpectStatic, contractName: string) {
    const appSpec = lazyLoad.getResult().find((s) => s.name === contractName)
    if (appSpec === undefined) {
      expect.fail(`${path} does not contain an ARC4 contract "${contractName}"`)
    } else {
      return appSpec
    }
  }

  function* getContracts(): Iterable<[name: TContracts, config: ContractConfig]> {
    if (Array.isArray(contracts)) {
      for (const c of contracts) {
        yield [c, {}]
      }
    } else {
      for (const [c, cfg] of Object.entries(contracts) as Array<[TContracts, ContractConfig]>) {
        yield [c, cfg]
      }
    }
  }

  const ctx: DeliberateAny = { localnet }
  for (const [contractName, config] of getContracts()) {
    ctx[`appSpec${contractName}`] = async ({ expect }: { expect: ExpectStatic }, use: Use<Arc56Contract>) => {
      await use(getAppSpec(expect, contractName))
    }

    ctx[`appFactory${contractName}`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<AppFactory>,
    ) => {
      const appSpec = getAppSpec(expect, contractName)
      await use(
        localnet.algorand.client.getAppFactory({
          defaultSender: localnet.context.testAccount.addr,
          appSpec: appSpec!,
        }),
      )
    }
    ctx[`appClient${contractName}`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<AppClient>,
    ) => {
      const appSpec = getAppSpec(expect, contractName)
      const appFactory = localnet.algorand.client.getAppFactory({
        defaultSender: localnet.context.testAccount.addr,
        appSpec: appSpec!,
      })
      const { appClient } = await appFactory.deploy(config.deployParams ?? {})
      await use(appClient)
    }
  }

  const extendedTest = algorandTestFixture(localnet).extend<Arc4FixtureContextFor<TContracts>>(ctx)
  return [extendedTest, localnet] as readonly [typeof extendedTest, AlgorandFixture]
}

function loadFromPath(pathToLoad: string): Arc56Contract[] {
  const appSpecs = new Array<Arc56Contract>()
  const isDir = fs.lstatSync(pathToLoad).isDirectory()
  if (!isDir && pathToLoad.endsWith('.arc56.json')) {
    const fileContent = fs.readFileSync(pathToLoad, 'utf-8')
    appSpecs.push(JSON.parse(fileContent))
  } else if (isDir) {
    using dirHandle = getDirHandle(pathToLoad)
    let dirent
    while ((dirent = dirHandle.dir.readSync()) !== null) {
      if (dirent.isFile() && dirent.name.endsWith('.arc56.json')) {
        const fullFilePath = path.join(pathToLoad, dirent.name)
        const fileContent = fs.readFileSync(fullFilePath, 'utf-8')
        appSpecs.push(JSON.parse(fileContent))
      }
    }
  }
  return appSpecs
}

const getDirHandle = (path: string) => {
  const dir = fs.opendirSync(path)
  return {
    dir,
    [Symbol.dispose]: () => dir.closeSync(),
  }
}
