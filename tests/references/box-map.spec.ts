import { biguint, BigUint, BoxMap, Bytes, bytes, op, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, test } from 'vitest'
import { MAX_UINT64 } from '../../src/constants'
import { DeliberateAny } from '../../src/typescript-helpers'
import { asBigUintCls, asBytes, asUint64Cls, toBytes } from '../../src/util'

const BOX_NOT_CREATED_ERROR = 'Box has not been created'

describe('BoxMap', () => {
  const ctx = new TestExecutionContext()
  const keyPrefix = Bytes('test_key_prefix')
  const testUint64BoxMap = (test: (boxMap: BoxMap<bytes, uint64>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const boxMap = BoxMap<bytes, uint64>({ keyPrefix })
      test(boxMap)
    })
  }
  const testBytesBoxMap = (test: (boxMap: BoxMap<string, bytes>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const boxMap = BoxMap<string, bytes>({ keyPrefix })
      test(boxMap)
    })
  }
  const testStringBoxMap = (test: (boxMap: BoxMap<biguint, string>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const boxMap = BoxMap<biguint, string>({ keyPrefix })
      test(boxMap)
    })
  }
  const testBigUintBoxMap = (test: (boxMap: BoxMap<uint64, biguint>) => void) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const boxMap = BoxMap<uint64, biguint>({ keyPrefix })
      test(boxMap)
    })
  }
  afterEach(() => {
    ctx.reset()
  })

  test.for(['key_prefix', Bytes('key_prefix')])('can be initialised with key prefix %s', (keyPrefix) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = BoxMap<bytes, bytes>({ keyPrefix })

      expect(box.keyPrefix.length.valueOf()).toBeGreaterThan(0)
      expect(box.keyPrefix).toEqual(asBytes(keyPrefix))
      expect(() => box.get(Bytes(''))).toThrow(BOX_NOT_CREATED_ERROR)
      expect(() => box.length(Bytes(''))).toThrow(BOX_NOT_CREATED_ERROR)
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.each([
    [Bytes('abc'), Uint64(100), testUint64BoxMap],
    ['def', Bytes('Test'), testBytesBoxMap],
    [BigUint(123), 'Test', testStringBoxMap],
    [Uint64(456), BigUint(MAX_UINT64), testBigUintBoxMap],
  ])('key %s and value %s can be set as value', (key, value, testBoxMap) => {
    testBoxMap((boxMap) => {
      boxMap.set(key as never, value as never)

      const boxContent = (boxMap as DeliberateAny).get(key)
      const fullKey = keyPrefix.concat(toBytes(key))

      const [opBoxContent, opExists] = op.Box.get(fullKey)
      const [opLength, _] = op.Box.length(fullKey)

      expect(opExists).toBe(true)
      expect(boxMap.length(key as never)).toEqual(opLength)
      expect(toBytes(boxContent)).toEqual(opBoxContent)
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.each([
    [Bytes('abc'), Uint64(100), testUint64BoxMap],
    ['def', Bytes('Test'), testBytesBoxMap],
    [BigUint(123), 'Test', testStringBoxMap],
    [Uint64(456), BigUint(MAX_UINT64), testBigUintBoxMap],
  ])('key %s and value %s can be delete', (key, value, testBoxMap) => {
    testBoxMap((boxMap) => {
      boxMap.set(key as never, value as never)

      boxMap.delete(key as never)

      expect(() => (boxMap as DeliberateAny).get(key)).toThrow(BOX_NOT_CREATED_ERROR)
      const fullKey = keyPrefix.concat(toBytes(key))
      const [opBoxContent, opExists] = op.Box.get(fullKey)
      expect(opExists).toBe(false)
      expect(opBoxContent).toEqual(Bytes(''))
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.each([
    [Bytes('abc'), Uint64(100), testUint64BoxMap],
    ['def', Bytes('Test'), testBytesBoxMap],
    [BigUint(123), 'Test', testStringBoxMap],
    [Uint64(456), BigUint(MAX_UINT64), testBigUintBoxMap],
  ])('can retrieve existing key %s and value %s using maybe', (key, value, testBoxMap) => {
    testBoxMap((boxMap) => {
      boxMap.set(key as never, value as never)

      const [content, exists] = boxMap.maybe(key as never)

      const fullKey = keyPrefix.concat(toBytes(key))
      const [opContent, opExists] = op.Box.get(fullKey)
      const [opLength, _] = op.Box.length(fullKey)

      expect(exists).toBe(true)
      expect(opExists).toBe(true)
      expect(boxMap.length(key as never)).toEqual(opLength)
      expect(toBytes(content)).toEqual(opContent)
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.each([
    [Bytes('abc'), Uint64(100), Uint64(0), testUint64BoxMap],
    ['def', Bytes('Test'), Bytes(''), testBytesBoxMap],
    [BigUint(123), 'Test', '', testStringBoxMap],
    [Uint64(456), BigUint(MAX_UINT64), BigUint(0), testBigUintBoxMap],
  ])('can retrieve non-existing value using maybe', (key, value, expectedEmptyValue, testBoxMap) => {
    testBoxMap((boxMap) => {
      boxMap.set(key as never, value as never)
      boxMap.delete(key as never)

      const [content, exists] = boxMap.maybe(key as never)

      expect(exists).toBe(false)
      expect(content).toEqual(expectedEmptyValue)

      const fullKey = keyPrefix.concat(toBytes(key))
      const [opContent, opExists] = op.Box.get(fullKey)
      expect(opExists).toBe(false)
      expect(opContent).toEqual(Bytes(''))
    })
  })

  test.each([
    [Bytes('abc'), Uint64(100), Uint64(200), asUint64Cls(200).toBytes().asAlgoTs(), testUint64BoxMap],
    ['def', Bytes('Test1'), Bytes('hello'), Bytes('hello'), testBytesBoxMap],
    [BigUint(123), 'Test1', 'hello', Bytes('hello'), testStringBoxMap],
    [Uint64(456), BigUint(100), BigUint(200), asBigUintCls(200).toBytes().asAlgoTs(), testBigUintBoxMap],
  ])('can get typed value after using op.Box.put', (key, value, newValue, newBytesValue, testBoxMap) => {
    testBoxMap((boxMap) => {
      boxMap.set(key as never, value as never)
      expect((boxMap as DeliberateAny).get(key)).toEqual(value)

      const fullKey = keyPrefix.concat(toBytes(key))
      op.Box.put(fullKey, newBytesValue)
      const [opContent, _] = op.Box.get(fullKey)

      expect(opContent).toEqual(newBytesValue)
      expect((boxMap as DeliberateAny).get(key)).toEqual(newValue)
    })
  })
})
