import { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { Account, Bytes } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import {
  AddressImpl,
  BoolImpl,
  ByteImpl,
  DynamicBytesImpl,
  StrImpl,
  UintNImpl,
} from '@algorandfoundation/algorand-typescript-testing/runtime-helpers'
import { Address, ARC4Encoded, BitSize, Bool, Byte, DynamicBytes, Str, UintN } from '@algorandfoundation/algorand-typescript/arc4'
import { afterEach, describe, expect, test } from 'vitest'
import { OnApplicationComplete } from '../src/constants'
import { DeliberateAny } from '../src/typescript-helpers'
import { LocalStateContract } from './artifacts/state-ops/contract.algo'
import arc4AppLocalAppSpecJson from './artifacts/state-ops/data/LocalStateContract.arc32.json'
import { getAlgorandAppClient, getAvmResult, getLocalNetDefaultAccount } from './avm-invoker'

describe('ARC4 AppLocal values', async () => {
  const appClient = await getAlgorandAppClient(arc4AppLocalAppSpecJson as AppSpec)
  const localNetAccount = await getLocalNetDefaultAccount()
  const defaultSenderAccountAddress = Bytes.fromBase32(localNetAccount.addr.toString())
  const ctx = new TestExecutionContext(defaultSenderAccountAddress)
  await tryOptIn(appClient)

  afterEach(async () => {
    ctx.reset()
  })

  const testData = ['_implicit_key', ''].flatMap((implicit) => [
    {
      methodName: `get${implicit}_arc4_uintn64`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as UintNImpl<BitSize>
        const bitSize = UintNImpl.getMaxBitsLength(arc4Value.typeInfo)
        expect(arc4Value).toBeInstanceOf(UintN)
        expect(bitSize).toEqual(64)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      methodName: `get${implicit}_arc4_str`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as StrImpl
        expect(arc4Value).toBeInstanceOf(Str)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      methodName: `get${implicit}_arc4_byte`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as ByteImpl
        expect(arc4Value).toBeInstanceOf(Byte)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      methodName: `get${implicit}_arc4_bool`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as BoolImpl
        expect(arc4Value).toBeInstanceOf(Bool)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      methodName: `get${implicit}_arc4_address`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as AddressImpl
        expect(arc4Value).toBeInstanceOf(Address)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      methodName: `get${implicit}_arc4_uintn128`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as UintNImpl<BitSize>
        const bitSize = UintNImpl.getMaxBitsLength(arc4Value.typeInfo)
        expect(arc4Value).toBeInstanceOf(UintN)
        expect(bitSize).toEqual(128)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      methodName: `get${implicit}_arc4_dynamic_bytes`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as DynamicBytesImpl
        expect(arc4Value).toBeInstanceOf(DynamicBytes)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
  ])

  test.each(testData)('should be able to get arc4 state values', async (data) => {
    const avmResult = await getAvmResult({ appClient }, data.methodName, localNetAccount.addr.toString())
    const contract = ctx.contract.create(LocalStateContract)
    contract.opt_in()
    const result = contract[data.methodName as keyof LocalStateContract](Account(defaultSenderAccountAddress)) as ARC4Encoded
    data.assert(result, avmResult)
  })
})
const tryOptIn = async (client: AppClient) => {
  try {
    await client.send.call({ method: 'opt_in', args: [], onComplete: OnApplicationComplete.OptInOC })
  } catch (e) {
    if (!(e as DeliberateAny).message.includes('has already opted in to app')) {
      throw e
    }
    // ignore error if account has already opted in
  }
}
