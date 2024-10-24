import { bytes, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { MAX_BOX_SIZE } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes, asBytesCls, asNumber, conactUint8Arrays, toBytes } from '../util'

export const Box: internal.opTypes.BoxType = {
  create(a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): boolean {
    const name = asBytes(a)
    const size = asNumber(b)
    if (name.length === 0 || size > MAX_BOX_SIZE) {
      throw new internal.errors.InternalError('Invalid box name or size')
    }
    const app = lazyContext.activeApplication
    if (lazyContext.ledger.boxExists(app, name)) {
      return false
    }
    lazyContext.ledger.setBox(app, name, new Uint8Array(Array(size).fill(0)))
    return true
  },
  delete(a: internal.primitives.StubBytesCompat): boolean {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      return false
    }
    lazyContext.ledger.deleteBox(app, name)
    return true
  },
  extract(a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat, c: internal.primitives.StubUint64Compat): bytes {
    const name = asBytes(a)
    const start = asNumber(b)
    const length = asNumber(c)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    if (boxContent instanceof Uint8Array) {
      return toBytes(boxContent.slice(start, start + length))
    }
    const result = toBytes(boxContent).slice(start, start + length)
    return result
  },
  get(a: internal.primitives.StubBytesCompat): readonly [bytes, boolean] {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    const boxContent = lazyContext.ledger.getBox(app, name)
    return [toBytes(boxContent), lazyContext.ledger.boxExists(app, name)]
  },
  length(a: internal.primitives.StubBytesCompat): readonly [uint64, boolean] {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    const boxContent = lazyContext.ledger.getBox(app, name)
    const exists = lazyContext.ledger.boxExists(app, name)
    if (boxContent instanceof Uint8Array) {
      return [boxContent.length, exists]
    }
    const bytesContent = toBytes(boxContent)
    return [bytesContent.length, exists]
  },
  put(a: internal.primitives.StubBytesCompat, b: internal.primitives.StubBytesCompat): void {
    const name = asBytes(a)
    const app = lazyContext.activeApplication
    const newContent = asBytes(b)
    if (lazyContext.ledger.boxExists(app, name)) {
      const boxContent = lazyContext.ledger.getBox(app, name)
      const length = boxContent instanceof Uint8Array ? boxContent.length : toBytes(boxContent).length
      if (asNumber(length) !== asNumber(newContent.length)) {
        throw new internal.errors.InternalError('New content length does not match existing box length')
      }
    }
    lazyContext.ledger.setBox(app, name, newContent)
  },
  replace(a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat, c: internal.primitives.StubBytesCompat): void {
    const name = asBytes(a)
    const start = asNumber(b)
    const newContent = asBytesCls(c).asUint8Array()
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const uint8ArrayContent = boxContent instanceof Uint8Array ? boxContent : asBytesCls(toBytes(boxContent)).asUint8Array()
    if (start + newContent.length > uint8ArrayContent.length) {
      throw new internal.errors.InternalError('Replacement content exceeds box size')
    }
    const updatedContent = conactUint8Arrays(
      uint8ArrayContent.slice(0, start),
      newContent,
      uint8ArrayContent.slice(start + newContent.length),
    )
    lazyContext.ledger.setBox(app, name, updatedContent)
  },
  resize(a: internal.primitives.StubBytesCompat, b: internal.primitives.StubUint64Compat): void {
    const name = asBytes(a)
    const newSize = asNumber(b)
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const uint8ArrayContent = boxContent instanceof Uint8Array ? boxContent : asBytesCls(toBytes(boxContent)).asUint8Array()
    const size = uint8ArrayContent.length
    let updatedContent
    if (newSize > size) {
      updatedContent = conactUint8Arrays(uint8ArrayContent, new Uint8Array(Array(newSize - size).fill(0)))
    } else {
      updatedContent = uint8ArrayContent.slice(0, newSize)
    }
    lazyContext.ledger.setBox(app, name, updatedContent)
  },
  splice(
    a: internal.primitives.StubBytesCompat,
    b: internal.primitives.StubUint64Compat,
    c: internal.primitives.StubUint64Compat,
    d: internal.primitives.StubBytesCompat,
  ): void {
    const name = asBytes(a)
    const start = asNumber(b)
    const length = asNumber(c)
    const newContent = asBytesCls(d).asUint8Array()
    const app = lazyContext.activeApplication
    if (!lazyContext.ledger.boxExists(app, name)) {
      throw new internal.errors.InternalError('Box does not exist')
    }
    const boxContent = lazyContext.ledger.getBox(app, name)
    const uint8ArrayContent = boxContent instanceof Uint8Array ? boxContent : asBytesCls(toBytes(boxContent)).asUint8Array()
    const size = uint8ArrayContent.length
    if (start > size) {
      throw new internal.errors.InternalError('Start index exceeds box size')
    }
    const end = Math.min(start + length, size)
    let updatedContent = conactUint8Arrays(uint8ArrayContent.slice(0, start), newContent, uint8ArrayContent.slice(end))
    //  Adjust the size if necessary
    if (updatedContent.length > size) {
      updatedContent = updatedContent.slice(0, size)
    } else if (updatedContent.length < size) {
      updatedContent = conactUint8Arrays(updatedContent, new Uint8Array(Array(size - asNumber(updatedContent.length)).fill(0)))
    }
    lazyContext.ledger.setBox(app, name, updatedContent)
  },
}
