import { Bytes, bytes, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { MAX_BOX_SIZE } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes, asNumber, toBytes } from '../util'

export const Box: internal.opTypes.BoxType = {
  create: function (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): boolean {
    const name = asBytes(a)
    const size = asNumber(b)
    if (name.length === 0 || size > MAX_BOX_SIZE) {
      throw new internal.errors.InternalError('Invalid box name or size')
    }
    const app = lazyContext.activeApplication
    if (lazyContext.ledger.boxExists(app, name)) {
      return false
    }
    lazyContext.ledger.setBox(app, name, Bytes(Array(size).fill(0)))
    return true
  },
  delete: function (a: internal.primitives.StubBytesCompat): boolean {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      return false
    }
    lazyContext.ledger.deleteBox(app, name)
    return true
  },
  extract: function (
    a: internal.primitives.StubBytesCompat,
    b: internal.primitives.StubUint64Compat,
    c: internal.primitives.StubUint64Compat,
  ): bytes {
    const name = asBytes(a)
    const start = asNumber(b)
    const length = asNumber(c)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const result = toBytes(boxContent).slice(start, start + length)
    return result
  },
  get: function (a: internal.primitives.StubBytesCompat): readonly [bytes, boolean] {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    const boxContent = lazyContext.ledger.getBox(app, name)
    return [toBytes(boxContent), lazyContext.ledger.boxExists(app, name)]
  },
  length: function (a: internal.primitives.StubBytesCompat): readonly [uint64, boolean] {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    const boxContent = lazyContext.ledger.getBox(app, name)
    const bytesContent = toBytes(boxContent)
    return [bytesContent.length, lazyContext.ledger.boxExists(app, name)]
  },
  put: function (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubBytesCompat): void {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    const newContent = asBytes(b)
    if (lazyContext.ledger.boxExists(app, name)) {
      const boxContent = lazyContext.ledger.getBox(app, name)
      const bytesContent = toBytes(boxContent)
      if (bytesContent.length !== newContent.length) {
        throw new internal.errors.InternalError('New content length does not match existing box length')
      }
    }
    lazyContext.ledger.setBox(app, name, newContent)
  },
  replace: function (
    a: internal.primitives.StubBytesCompat,
    b: internal.primitives.StubUint64Compat,
    c: internal.primitives.StubBytesCompat,
  ): void {
    const name = asBytes(a)
    const start = asNumber(b)
    const newContent = asBytes(c)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const bytesContent = toBytes(boxContent)
    if (start + newContent.length > bytesContent.length) {
      throw new internal.errors.InternalError('Replacement content exceeds box size')
    }
    const updatedContent = bytesContent
      .slice(0, start)
      .concat(newContent)
      .concat(bytesContent.slice(start + newContent.length))
    lazyContext.ledger.setBox(app, name, Bytes(updatedContent))
  },
  resize: function (a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): void {
    const name = asBytes(a)
    const newSize = asNumber(b)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const bytesContent = toBytes(boxContent)
    let updatedContent
    if (newSize > bytesContent.length) {
      updatedContent = bytesContent.concat(Bytes(Array(newSize - bytesContent.length).fill(0)))
    } else {
      updatedContent = bytesContent.slice(0, newSize)
    }
    lazyContext.ledger.setBox(app, name, Bytes(updatedContent))
  },
  splice: function (
    a: internal.primitives.StubBytesCompat,
    b: internal.primitives.StubUint64Compat,
    c: internal.primitives.StubUint64Compat,
    d: internal.primitives.StubBytesCompat,
  ): void {
    const name = asBytes(a)
    const start = asNumber(b)
    const length = asNumber(c)
    const newContent = asBytes(d)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const bytesContent = toBytes(boxContent)
    if (start > bytesContent.length) {
      throw new internal.errors.InternalError('Start index exceeds box size')
    }
    const end = Math.min(start + length, bytesContent.length)
    let updatedContent = bytesContent.slice(0, start).concat(newContent).concat(bytesContent.slice(end))

    //  Adjust the size if necessary
    if (updatedContent.length > bytesContent.length) {
      updatedContent = updatedContent.slice(0, bytesContent.length)
    } else if (updatedContent.length < bytesContent.length) {
      updatedContent = updatedContent.concat(Bytes(Array(bytesContent.length - updatedContent.length).fill(0)))
    }
    lazyContext.ledger.setBox(app, name, Bytes(updatedContent))
  },
}
