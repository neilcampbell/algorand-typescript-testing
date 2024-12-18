import { Account, Bytes } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import algosdk from 'algosdk'
import { afterEach, describe, expect, it } from 'vitest'
import { ZERO_ADDRESS } from '../../src/constants'
import HashedTimeLockedLogicSig from './signature.algo'

describe('HTLC LogicSig', () => {
  const ctx = new TestExecutionContext()

  afterEach(() => {
    ctx.reset()
  })

  it('seller receives payment if correct secret is provided', () => {
    const receiverAddress = Bytes(algosdk.decodeAddress('6ZHGHH5Z5CTPCF5WCESXMGRSVK7QJETR63M3NY5FJCUYDHO57VTCMJOBGY').publicKey)
    ctx.txn
      .createScope([
        ctx.any.txn.payment({
          fee: 500,
          firstValid: 1000,
          closeRemainderTo: Account(ZERO_ADDRESS),
          rekeyTo: Account(ZERO_ADDRESS),
          receiver: Account(receiverAddress),
        }),
      ])
      .execute(() => {
        const result = ctx.executeLogicSig(new HashedTimeLockedLogicSig(), Bytes('secret'))
        expect(result).toBe(true)
      })
  })
})
