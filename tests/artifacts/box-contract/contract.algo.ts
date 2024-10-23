import { arc4, assert, Box, Bytes, op, TransactionType, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'

export class BoxContract extends arc4.Contract {
  oca = Box<arc4.OnCompleteAction>()
  txn = Box<TransactionType>()

  @arc4.abimethod()
  public storeEnums(): void {
    this.oca.value = arc4.OnCompleteAction.OptIn
    this.txn.value = TransactionType.ApplicationCall
  }

  @arc4.abimethod()
  public read_enums(): readonly [uint64, uint64] {
    assert(op.Box.get(Bytes('oca'))[0] === op.itob(this.oca.value))
    assert(op.Box.get(Bytes('txn'))[0] === op.itob(this.txn.value))

    return [Uint64(this.oca.value), Uint64(this.txn.value)]
    // TODO: use arc4 types when available
    // return arc4.Tuple((arc4.UInt64(this.oca.value), arc4.UInt64(this.txn.value)))
  }
}
