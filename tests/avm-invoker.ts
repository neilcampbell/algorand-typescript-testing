import * as algokit from '@algorandfoundation/algokit-utils'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { ABIAppCallArg, AppCallTransactionResult } from '@algorandfoundation/algokit-utils/types/app'
import { ApplicationClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { KmdAccountManager } from '@algorandfoundation/algokit-utils/types/kmd-account-manager'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import { SendTransactionFrom, SendTransactionParams } from '@algorandfoundation/algokit-utils/types/transaction'
import { Account, Bytes, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { ABIValue, generateAccount } from 'algosdk'
import { randomUUID } from 'crypto'
import { asUint64, getRandomNumber, Lazy } from '../src/util'

algokit.Config.configure({ logger: nullLogger })

const algorandClient = Lazy(() => algokit.AlgorandClient.defaultLocalNet())

export const INITIAL_BALANCE_MICRO_ALGOS = Number(20e6)

export const getAlgorandAppClient = async (appSpec: AppSpec) => {
  const [appClient, _] = await getAlgorandAppClientWithApp(appSpec)
  return appClient
}

export const getAlgorandAppClientWithApp = async (appSpec: AppSpec) => {
  const client = algorandClient()
  const defaultSigner = await client.account.kmd.getLocalNetDispenserAccount()
  const appClient = algokit.getAppClient({ app: appSpec, resolveBy: 'id', id: 0, sender: defaultSigner.account }, client.client.algod)
  const app = await appClient.create({ note: randomUUID() })
  return [appClient, app] as const
}

const invokeMethod = async (
  appClient: ApplicationClient,
  method: string,
  sendParams?: SendTransactionParams,
  ...methodArgs: ABIAppCallArg[]
): Promise<AppCallTransactionResult | undefined> => {
  const response = await appClient.call({ method, methodArgs, note: randomUUID(), sendParams })

  if (response.return?.decodeError) {
    throw response.return.decodeError
  }
  return response
}

export const getAvmResult = async <TResult extends ABIValue>(
  { appClient, sendParams }: { appClient: ApplicationClient; sendParams?: SendTransactionParams },
  method: string,
  ...methodArgs: ABIAppCallArg[]
): Promise<TResult> => {
  const result = await invokeMethod(appClient, method, sendParams, ...methodArgs)
  return result?.return?.returnValue as TResult
}

export const getAvmResultLog = async (
  { appClient, sendParams }: { appClient: ApplicationClient; sendParams?: SendTransactionParams },
  method: string,
  ...methodArgs: ABIAppCallArg[]
): Promise<Uint8Array[] | undefined> => {
  const result = await invokeMethod(appClient, method, sendParams, ...methodArgs)
  return result?.confirmation?.logs
}

export const getAvmResultRaw = async (
  { appClient, sendParams }: { appClient: ApplicationClient; sendParams?: SendTransactionParams },
  method: string,
  ...methodArgs: ABIAppCallArg[]
): Promise<Uint8Array | undefined> => {
  const result = await invokeMethod(appClient, method, sendParams, ...methodArgs)
  return result?.return?.rawReturnValue
}

export const getLocalNetDefaultAccount = () => {
  const client = algorandClient()
  const kmdAccountManager = new KmdAccountManager(client.client)
  return kmdAccountManager.getLocalNetDispenserAccount()
}

export const generateTestAccount = async (): Promise<Account> => {
  const account = generateAccount()

  await algokit.ensureFunded(
    {
      accountToFund: account,
      minSpendingBalance: AlgoAmount.MicroAlgos(INITIAL_BALANCE_MICRO_ALGOS),
    },
    algorandClient().client.algod,
  )
  return Account(Bytes.fromBase32(account.addr))
}

export const generateTestAsset = async (fields: {
  creator: SendTransactionFrom
  total?: number | bigint
  decimals?: number
  name?: string
  unit?: string
  url?: string
  metadataHash?: string
  manager?: SendTransactionFrom
  reserveAccount?: SendTransactionFrom
  freezeAccount?: SendTransactionFrom
  clawbackAccount?: SendTransactionFrom
  frozenByDefault?: boolean
}): Promise<uint64> => {
  const client = algorandClient()
  if (fields.total === undefined) {
    fields.total = getRandomNumber(20, 120)
  }

  if (fields.name === undefined) {
    fields.name = `ASA ${getRandomNumber(1, 100)}_${getRandomNumber(1, 100)}_${fields.total}`
  }

  if (fields.decimals === undefined) {
    fields.decimals = 0
  }
  const params = await client.getSuggestedParams()
  const x = await algokit.createAsset(
    {
      creator: fields.creator,
      total: BigInt(fields.total) * 10n ** BigInt(fields.decimals),
      decimals: fields.decimals,
      name: fields.name,
      unit: fields.unit ?? '',
      url: fields.url ?? 'https://algorand.co',
      metadataHash: fields.metadataHash,
      manager: fields.manager,
      reserveAccount: fields.reserveAccount,
      freezeAccount: fields.freezeAccount,
      clawbackAccount: fields.clawbackAccount,
      frozenByDefault: fields.frozenByDefault ?? false,
      transactionParams: params,
      note: randomUUID(),
    },
    client.client.algod,
  )
  if (x.confirmation === undefined) {
    internal.errors.internalError('Failed to create asset')
  }
  return asUint64(x.confirmation.assetIndex)
}
