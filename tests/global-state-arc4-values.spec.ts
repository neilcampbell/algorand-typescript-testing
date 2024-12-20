import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { Bytes } from '@algorandfoundation/algorand-typescript'
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
import { DeliberateAny, FunctionKeys } from '../src/typescript-helpers'
import { GlobalStateContract } from './artifacts/state-ops/contract.algo'
import arc4AppGlobalAppSpecJson from './artifacts/state-ops/data/GlobalStateContract.arc32.json'
import { getAlgorandAppClient, getAvmResult, getLocalNetDefaultAccount } from './avm-invoker'
import { asUint8Array } from './util'

describe('ARC4 AppGlobal values', async () => {
  const appClient = await getAlgorandAppClient(arc4AppGlobalAppSpecJson as AppSpec)
  const localNetAccount = await getLocalNetDefaultAccount()
  const defaultSenderAccountAddress = Bytes.fromBase32(localNetAccount.addr.toString())
  const ctx = new TestExecutionContext(defaultSenderAccountAddress)

  afterEach(async () => {
    ctx.reset()
  })

  const testData = ['_implicit_key', ''].flatMap((implicit) => [
    {
      nativeValue: 42,
      abiValue: new UintN<64>(42),
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
      nativeValue: 'World',
      abiValue: new Str('World'),
      methodName: `get${implicit}_arc4_str`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as StrImpl
        expect(arc4Value).toBeInstanceOf(Str)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      nativeValue: 12,
      abiValue: new Byte(12),
      methodName: `get${implicit}_arc4_byte`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as ByteImpl
        expect(arc4Value).toBeInstanceOf(Byte)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      nativeValue: false,
      abiValue: new Bool(false),
      methodName: `get${implicit}_arc4_bool`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as BoolImpl
        expect(arc4Value).toBeInstanceOf(Bool)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      nativeValue: asUint8Array(Bytes.fromHex(`${'00'.repeat(31)}ff`)),
      abiValue: new Address(Bytes.fromHex(`${'00'.repeat(31)}ff`)),
      methodName: `get${implicit}_arc4_address`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as AddressImpl
        expect(arc4Value).toBeInstanceOf(Address)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
    {
      nativeValue: 2n ** 102n,
      abiValue: new UintN<128>(2n ** 102n),
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
      nativeValue: asUint8Array(Bytes.fromHex(`${'00'.repeat(30)}${'ff'.repeat(2)}`)),
      abiValue: new DynamicBytes(Bytes.fromHex(`${'00'.repeat(30)}${'ff'.repeat(2)}`)),
      methodName: `get${implicit}_arc4_dynamic_bytes`,
      assert: (value: ARC4Encoded, expectedValue: DeliberateAny) => {
        const arc4Value = value as DynamicBytesImpl
        expect(arc4Value).toBeInstanceOf(DynamicBytes)
        expect(arc4Value.native).toEqual(expectedValue)
      },
    },
  ])

  test.each(testData)('should be able to get arc4 state values', async (data) => {
    const avmResult = await getAvmResult({ appClient }, data.methodName)
    const contract = ctx.contract.create(GlobalStateContract)
    const result = contract[data.methodName as FunctionKeys<GlobalStateContract>](undefined as never) as ARC4Encoded
    data.assert(result, avmResult)
  })

  test.each(testData)('should be able to set arc4 state values', async (data) => {
    const setMethodName = data.methodName.replace('get', 'set')
    await getAvmResult({ appClient }, setMethodName, data.nativeValue)
    const contract = ctx.contract.create(GlobalStateContract)
    contract[setMethodName as FunctionKeys<GlobalStateContract>](data.abiValue as never)

    const avmResult = await getAvmResult({ appClient }, data.methodName)
    const result = contract[data.methodName as FunctionKeys<GlobalStateContract>](undefined as never) as ARC4Encoded
    data.assert(result, avmResult)
  })
})
