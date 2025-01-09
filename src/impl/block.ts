import { Account, bytes, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asUint64 } from '../util'
import { itob } from './pure'

export const Block: internal.opTypes.BlockType = {
  blkSeed: function (a: internal.primitives.StubUint64Compat): bytes {
    return itob(lazyContext.ledger.getBlockContent(a).seed)
  },
  blkTimestamp: function (a: internal.primitives.StubUint64Compat): uint64 {
    return asUint64(lazyContext.ledger.getBlockContent(a).timestamp)
  },
  // TODO: implement v11 methods
  blkProposer: function (_a: uint64): Account {
    throw new Error('Function not implemented.')
  },
  blkFeesCollected: function (_a: uint64): uint64 {
    throw new Error('Function not implemented.')
  },
  blkBonus: function (_a: uint64): uint64 {
    throw new Error('Function not implemented.')
  },
  blkBranch: function (_a: uint64): bytes {
    throw new Error('Function not implemented.')
  },
  blkFeeSink: function (_a: uint64): Account {
    throw new Error('Function not implemented.')
  },
  blkProtocol: function (_a: uint64): bytes {
    throw new Error('Function not implemented.')
  },
  blkTxnCounter: function (_a: uint64): uint64 {
    throw new Error('Function not implemented.')
  },
  blkProposerPayout: function (_a: uint64): uint64 {
    throw new Error('Function not implemented.')
  },
}
