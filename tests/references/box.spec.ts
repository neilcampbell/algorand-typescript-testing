import { arc4, BigUint, Box, Bytes, op, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { itob } from '@algorandfoundation/algorand-typescript/op'
import { afterEach, describe, expect, it, test } from 'vitest'
import { asBytes, toBytes } from '../../src/util'
import { BoxContract } from '../artifacts/box-contract/contract.algo'

class ATestContract extends arc4.Contract {
  uint64Box = Box<uint64>()
}

const BOX_NOT_CREATED_ERROR = 'Box has not been created'

describe('Box', () => {
  const ctx = new TestExecutionContext()

  afterEach(() => {
    ctx.reset()
  })

  it('can be initialised without key', () => {
    const contract = ctx.contract.create(ATestContract)
    expect(contract.uint64Box.key.toString()).toBe('uint64Box')
  })

  test.for(['key', Bytes('key')])('can be initialised with key %s', (key) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const box = Box({ key })
      expect(box.exists).toBe(false)
      expect(box.key).toEqual(asBytes(key))
      expect(() => box.value).toThrow(BOX_NOT_CREATED_ERROR)
      expect(() => box.length).toThrow(BOX_NOT_CREATED_ERROR)
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.for([Uint64(100), Bytes('Test'), 'Test', BigUint(100)])('%s can be set as value', (value) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const key = Bytes('test_key')
      const box = Box({ key })
      box.value = value

      const [content, exists] = op.Box.get(key)
      const [length, _] = op.Box.length(key)

      expect(exists).toBe(true)
      expect(box.length).toEqual(length)
      expect(content).toEqual(toBytes(value))
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.for([Uint64(100), Bytes('Test'), 'Test', BigUint(100)])('%s value can be delete', (value) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const key = Bytes('test_key')
      const box = Box({ key })
      box.value = value

      box.delete()

      expect(box.exists).toBe(false)
      expect(() => box.value).toThrow(BOX_NOT_CREATED_ERROR)

      const [content, exists] = op.Box.get(key)
      expect(exists).toBe(false)
      expect(content).toEqual(Bytes(''))
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.for([Uint64(100), Bytes('Test'), 'Test', BigUint(100)])('can retrieve existing value %s using maybe', (value) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const key = Bytes('test_key')
      const box = Box({ key })
      box.value = value

      const [content, exists] = box.maybe()
      const [opContent, opExists] = op.Box.get(key)

      expect(exists).toBe(true)
      expect(opExists).toBe(true)
      expect(opContent).toEqual(toBytes(content))
    })
  })

  // TODO: add tests for settign arc4 types as value
  test.for([Uint64(100), Bytes('Test'), 'Test', BigUint(100)])('can retrieve non-existing value using maybe', (value) => {
    ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
      const key = Bytes('test_key')
      const box = Box({ key })
      box.value = value
      box.delete()

      const [content, exists] = box.maybe()
      const [opContent, opExists] = op.Box.get(key)

      expect(exists).toBe(false)
      expect(opExists).toBe(false)
      expect(opContent).toEqual(Bytes(''))
      expect(toBytes(content)).toEqual(Bytes(''))
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
      expect(toBytes(ctx.ledger.getBox(app, "oca"))).toEqual(itob(oca))
      expect(toBytes(ctx.ledger.getBox(app, "txn"))).toEqual(itob(txn))
    })

  })
})
