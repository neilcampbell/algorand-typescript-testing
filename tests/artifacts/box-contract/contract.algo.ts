import { arc4, assert, Box, Bytes, op, TransactionType, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'

// type X = [a: uint64, b: string, c: bytes]
// type Y = { a: uint64; b: string; c: bytes }
// type Z = { x: X; y: Y }

export class BoxContract extends arc4.Contract {
  oca = Box<arc4.OnCompleteAction>({ key: Bytes('oca') })
  txn = Box<TransactionType>({ key: Bytes('txn') })

  // a = Box<X>({ key: Bytes('a') })
  // b = Box<Y>({ key: Bytes('b') })
  // c = Box<Z>({ key: Bytes('c') })
  // d = Box<Z[]>({ key: Bytes('d') })

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
