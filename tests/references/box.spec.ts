import { BigUint, biguint, Box, bytes, Bytes, op, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { itob } from '@algorandfoundation/algorand-typescript/op'
import { afterEach, describe, expect, it, test } from 'vitest'
import { asBigUintCls, asBytes, asUint64Cls, toBytes } from '../../src/util'
import { BoxContract } from '../artifacts/box-contract/contract.algo'

const BOX_NOT_CREATED_ERROR = 'Box has not been created'

describe('Box', () => {
  const ctx = new TestExecutionContext()
  const key = Bytes('test_key')
  const testUint64Box = (test: (box: Box<uint64>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box<uint64>({ key })
      test(box)
    })
  }
  const testBytesBox = (test: (box: Box<bytes>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box<bytes>({ key })
      test(box)
    })
  }
  const testStringBox = (test: (box: Box<string>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box<string>({ key })
      test(box)
    })
  }
  const testBigUintBox = (test: (box: Box<biguint>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box<biguint>({ key })
      test(box)
    })
  }
  const testBooleanBox = (test: (box: Box<boolean>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box<boolean>({ key })
      test(box)
    })
  }

  afterEach(() => {
    ctx.reset()
  })

  test.each(['key', Bytes('key')])('can be initialised with key %s', (key) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box({ key })
      expect(box.exists).toBe(false)
      expect(box.key).toEqual(asBytes(key))
      expect(() => box.value).toThrow(BOX_NOT_CREATED_ERROR)
      expect(() => box.length).toThrow(BOX_NOT_CREATED_ERROR)
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.each([
    [Uint64(100), testUint64Box],
    [Bytes('Test'), testBytesBox],
    ['Test', testStringBox],
    [BigUint(100), testBigUintBox],
  ])('%s can be set as value', (value, testBox) => {
    testBox((box) => {
      box.value = value

      const [content, exists] = op.Box.get(key)
      const [length, _] = op.Box.length(key)

      expect(exists).toBe(true)
      expect(box.length).toEqual(length)
      expect(content).toEqual(toBytes(value))
    })
  })

  // // TODO: add tests for settign arc4 types as value
  test.each([
    [Uint64(100), testUint64Box],
    [Bytes('Test'), testBytesBox],
    ['Test', testStringBox],
    [BigUint(100), testBigUintBox],
  ])('%s value can be delete', (value, testBox) => {
    testBox((box) => {
      box.value = value

      box.delete()

      expect(box.exists).toBe(false)
      expect(() => box.value).toThrow(BOX_NOT_CREATED_ERROR)

      const [content, exists] = op.Box.get(key)
      expect(exists).toBe(false)
      expect(content).toEqual(Bytes(''))
    })
  })

  // // TODO: add tests for settign arc4 types as value
  test.each([
    [Uint64(100), testUint64Box],
    [Bytes('Test'), testBytesBox],
    ['Test', testStringBox],
    [BigUint(100), testBigUintBox],
  ])('can retrieve existing value %s using maybe', (value, testBox) => {
    testBox((box) => {
      box.value = value

      const [content, exists] = box.maybe()
      const [opContent, opExists] = op.Box.get(key)

      expect(exists).toBe(true)
      expect(opExists).toBe(true)
      expect(opContent).toEqual(toBytes(content))
    })
  })

  // // TODO: add tests for settign arc4 types as value
  test.each([
    [Uint64(100), testUint64Box, Uint64(0)],
    [Bytes('Test'), testBytesBox, Bytes('')],
    ['Test', testStringBox, ''],
    [BigUint(100), testBigUintBox, BigUint(0)],
  ])('can retrieve non-existing value using maybe', (value, testBox, expectedValue) => {
    testBox((box) => {
      box.value = value
      box.delete()

      const [content, exists] = box.maybe()
      const [opContent, opExists] = op.Box.get(key)

      expect(exists).toBe(false)
      expect(opExists).toBe(false)
      expect(opContent).toEqual(Bytes(''))
      expect(content).toEqual(expectedValue)
    })
  })

  it('can store enum values', () => {
    const contract = ctx.contract.create(BoxContract)

    const deferredStoreCall = ctx.txn.deferAppCall(contract, contract.storeEnums)
    const deferredReadCall = ctx.txn.deferAppCall(contract, contract.read_enums)

    ctx.txn.createScope([deferredStoreCall, deferredReadCall]).execute(() => {
      deferredStoreCall.submit()
      const [oca, txn] = deferredReadCall.submit()

      const app = ctx.ledger.getApplicationForContract(contract)
      expect(toBytes(ctx.ledger.getBox(app, 'oca'))).toEqual(itob(oca))
      expect(toBytes(ctx.ledger.getBox(app, 'txn'))).toEqual(itob(txn))
    })
  })

  test.each([
    [Uint64(100), Uint64(200), asUint64Cls(200).toBytes().asAlgoTs(), testUint64Box],
    [BigUint(100), BigUint(200), asBigUintCls(200).toBytes().asAlgoTs(), testBigUintBox],
    [Bytes('abc'), Bytes('def'), Bytes('def'), testBytesBox],
    ['abc', 'def', Bytes('def'), testStringBox],
    [true, false, asUint64Cls(0).toBytes().asAlgoTs(), testBooleanBox],
  ])('can get typed value after using op.Box.put', (value, newValue, newBytesValue, testBox) => {
    testBox((box) => {
      box.value = value
      expect(box.value).toEqual(value)

      op.Box.put(key, newBytesValue)
      const [opContent, _] = op.Box.get(key)

      expect(opContent).toEqual(newBytesValue)
      expect(box.value).toEqual(newValue)
    })
  })
})
