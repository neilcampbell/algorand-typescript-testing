import { biguint, BigUint, BoxMap, Bytes, bytes, op, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { ARC4Encoded, DynamicArray, interpretAsArc4, Str, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { afterEach, describe, expect, test } from 'vitest'
import { MAX_UINT64 } from '../../src/constants'
import { DeliberateAny } from '../../src/typescript-helpers'
import { asBytes, toBytes } from '../../src/util'

const BOX_NOT_CREATED_ERROR = 'Box has not been created'

describe('BoxMap', () => {
  const ctx = new TestExecutionContext()
  const keyPrefix = Bytes('test_key_prefix')
  const testData = [
    {
      key: Bytes('abc'),
      value: Uint64(100),
      newValue: Uint64(200),
      emptyValue: Uint64(0),
      withBoxContext: (test: (boxMap: BoxMap<bytes, uint64>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<bytes, uint64>({ keyPrefix })
          test(boxMap)
        })
      },
    },
    {
      key: 'def',
      value: Bytes('Test1'),
      newValue: Bytes('hello'),
      emptyValue: Bytes(''),
      withBoxContext: (test: (boxMap: BoxMap<string, bytes>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<string, bytes>({ keyPrefix })
          test(boxMap)
        })
      },
    },
    {
      key: BigUint(123),
      value: 'Test1',
      newValue: 'hello',
      emptyValue: '',
      withBoxContext: (test: (boxMap: BoxMap<biguint, string>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<biguint, string>({ keyPrefix })
          test(boxMap)
        })
      },
    },
    {
      key: Uint64(456),
      value: BigUint(MAX_UINT64),
      newValue: BigUint(MAX_UINT64 - 1n),
      emptyValue: BigUint(0),
      withBoxContext: (test: (boxMap: BoxMap<uint64, biguint>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<uint64, biguint>({ keyPrefix })
          test(boxMap)
        })
      },
    },
    {
      key: new Str('ghi'),
      value: BigUint(100),
      newValue: BigUint(200),
      emptyValue: BigUint(0),
      withBoxContext: (test: (boxMap: BoxMap<Str, biguint>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<Str, biguint>({ keyPrefix })
          test(boxMap)
        })
      },
    },
    {
      key: Uint64(456),
      value: new Str('Test1'),
      newValue: new Str('hello'),
      emptyValue: interpretAsArc4<Str>(Bytes('')),
      withBoxContext: (test: (boxMap: BoxMap<uint64, Str>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<uint64, Str>({ keyPrefix })
          test(boxMap)
        })
      },
    },
    {
      key: new Str('jkl'),
      value: new DynamicArray(new UintN64(100), new UintN64(200)),
      newValue: new DynamicArray(new UintN64(200), new UintN64(300)),
      emptyValue: interpretAsArc4<DynamicArray<UintN64>>(Bytes('')),
      withBoxContext: (test: (boxMap: BoxMap<Str, DynamicArray<UintN64>>) => void) => {
        ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
          const boxMap = BoxMap<Str, DynamicArray<UintN64>>({ keyPrefix })
          test(boxMap)
        })
      },
    },
  ]

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

  test.each(testData)('key %s and value %s can be set as value', ({ key, value, withBoxContext }) => {
    withBoxContext((boxMap) => {
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

  test.each(testData)('key %s and value %s can be delete', ({ key, value, withBoxContext }) => {
    withBoxContext((boxMap) => {
      boxMap.set(key as never, value as never)

      boxMap.delete(key as never)

      expect(() => (boxMap as DeliberateAny).get(key)).toThrow(BOX_NOT_CREATED_ERROR)
      const fullKey = keyPrefix.concat(toBytes(key))
      const [opBoxContent, opExists] = op.Box.get(fullKey)
      expect(opExists).toBe(false)
      expect(opBoxContent).toEqual(Bytes(''))
    })
  })

  test.each(testData)('can retrieve existing key %s and value %s using maybe', ({ key, value, withBoxContext }) => {
    withBoxContext((boxMap) => {
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

  test.each(testData)('can retrieve non-existing value using maybe', ({ key, value, emptyValue, withBoxContext }) => {
    withBoxContext((boxMap) => {
      boxMap.set(key as never, value as never)
      boxMap.delete(key as never)

      const [content, exists] = boxMap.maybe(key as never)

      expect(exists).toBe(false)
      if (content instanceof ARC4Encoded) {
        expect(content.bytes).toEqual((emptyValue as ARC4Encoded).bytes)
      } else {
        expect(content).toEqual(emptyValue)
      }

      const fullKey = keyPrefix.concat(toBytes(key))
      const [opContent, opExists] = op.Box.get(fullKey)
      expect(opExists).toBe(false)
      expect(opContent).toEqual(Bytes(''))
    })
  })

  test.each(testData)('can get typed value after using op.Box.put', ({ key, value, newValue, withBoxContext }) => {
    withBoxContext((boxMap) => {
      boxMap.set(key as never, value as never)
      if (value instanceof ARC4Encoded) {
        expect((boxMap as DeliberateAny).get(key).bytes).toEqual(value.bytes)
      } else {
        expect((boxMap as DeliberateAny).get(key)).toEqual(value)
      }

      const newBytesValue = toBytes(newValue)
      const fullKey = keyPrefix.concat(toBytes(key))
      op.Box.put(fullKey, newBytesValue)
      const [opContent, _] = op.Box.get(fullKey)

      expect(opContent).toEqual(newBytesValue)
      if (newValue instanceof ARC4Encoded) {
        expect((boxMap as DeliberateAny).get(key).bytes).toEqual(newValue.bytes)
      } else {
        expect((boxMap as DeliberateAny).get(key)).toEqual(newValue)
      }
    })
  })
})
