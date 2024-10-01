import { bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'

export const Scratch: internal.opTypes.ScratchType = {
  loadBytes: function (a: internal.primitives.StubUint64Compat): bytes {
    const result = lazyContext.activeGroup.activeTransaction.getScratchSlot(a)
    if (result instanceof internal.primitives.BytesCls) {
      return result as bytes
    }
    throw new internal.errors.InternalError('Invalid scratch slot type')
  },
  loadUint64: function (a: internal.primitives.StubUint64Compat): uint64 {
    const result = lazyContext.activeGroup.activeTransaction.getScratchSlot(a)
    if (result instanceof internal.primitives.Uint64Cls) {
      return result as uint64
    }
    throw new internal.errors.InternalError('Invalid scratch slot type')
  },
  store: function (
    a: internal.primitives.StubUint64Compat,
    b: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat,
  ): void {
    lazyContext.activeGroup.activeTransaction.setScratchSlot(a, b)
  },
}
