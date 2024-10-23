import { arc4, BigUint, BoxMap, Bytes, bytes, op, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it, test } from 'vitest'
import { asBytes, toBytes } from '../../src/util'

class ATestContract extends arc4.Contract {
  uint64BoxMap = BoxMap<bytes, bytes>()
}

const BOX_NOT_CREATED_ERROR = 'Box has not been created'

describe('BoxMap', () => {
  const ctx = new TestExecutionContext()

  afterEach(() => {
    ctx.reset()
  })

  it('can be initialised without key', () => {
    const contract = ctx.contract.create(ATestContract)
    expect(contract.uint64BoxMap.keyPrefix.toString()).toBe('uint64BoxMap')
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
  test.for([
    [Bytes('abc'), Uint64(100)],
    ['def', Bytes('Test')],
    [BigUint(123), 'Test'],
  ])('key %s and value %s can be set as value', ([key, value]) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const keyPrefix = Bytes('test_key_prefix')
      const box = BoxMap({ keyPrefix })
      box.set(key, value)

      const boxContent = box.get(key)
      const fullKey = keyPrefix.concat(toBytes(key))

      const [opBoxContent, opExists] = op.Box.get(fullKey)
      const [opLength, _] = op.Box.length(fullKey)

      expect(opExists).toBe(true)
      expect(box.length(key)).toEqual(opLength)
      expect(toBytes(boxContent)).toEqual(opBoxContent)
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.for([
    [Bytes('abc'), Uint64(100)],
    ['def', Bytes('Test')],
    [BigUint(123), 'Test'],
  ])('key %s and value %s can be delete', ([key, value]) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const keyPrefix = Bytes('test_key_prefix')
      const box = BoxMap({ keyPrefix })
      box.set(key, value)

      box.delete(key)

      expect(() => box.get(key)).toThrow(BOX_NOT_CREATED_ERROR)
      const fullKey = keyPrefix.concat(toBytes(key))
      const [opBoxContent, opExists] = op.Box.get(fullKey)
      expect(opExists).toBe(false)
      expect(opBoxContent).toEqual(Bytes(''))
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.for([
    [Bytes('abc'), Uint64(100)],
    ['def', Bytes('Test')],
    [BigUint(123), 'Test'],
  ])('can retrieve existing key %s and value %s using maybe', ([key, value]) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const keyPrefix = Bytes('test_key_prefix')
      const box = BoxMap({ keyPrefix })
      box.set(key, value)

      const [content, exists] = box.maybe(key)

      const fullKey = keyPrefix.concat(toBytes(key))
      const [opContent, opExists] = op.Box.get(fullKey)
      const [opLength, _] = op.Box.length(fullKey)

      expect(exists).toBe(true)
      expect(opExists).toBe(true)
      expect(box.length(key)).toEqual(opLength)
      expect(toBytes(content)).toEqual(opContent)
    })
  })
  test.for([
    [Bytes('abc'), Uint64(100)],
    ['def', Bytes('Test')],
    [BigUint(123), 'Test'],
  ])('can retrieve non-existing value using maybe', ([key, value]) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const keyPrefix = Bytes('test_key_prefix')
      const box = BoxMap({ keyPrefix })
      box.set(key, value)
      box.delete(key)

      const [content, exists] = box.maybe(key)

      expect(exists).toBe(false)
      expect(toBytes(content)).toEqual(Bytes(''))

      const fullKey = keyPrefix.concat(toBytes(key))
      const [opContent, opExists] = op.Box.get(fullKey)
      expect(opExists).toBe(false)
      expect(opContent).toEqual(Bytes(''))
    })
  })
})
