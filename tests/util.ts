import { Bytes, bytes, internal } from '@algorandfoundation/algorand-typescript'
import { ABIValue } from 'algosdk'
import { createHash } from 'crypto'

export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize).fill(0)
  arr.forEach((v, i) => (paddedUint8Array[padSize + i] = v))
  return paddedUint8Array
}

export const asUint8Array = (value: internal.primitives.StubBytesCompat): Uint8Array =>
  internal.primitives.BytesCls.fromCompat(value).asUint8Array()

export const base64Encode = (value: internal.primitives.StubBytesCompat): bytes =>
  Bytes(Buffer.from(asUint8Array(value)).toString('base64'))

export const base64UrlEncode = (value: internal.primitives.StubBytesCompat): bytes =>
  Bytes(Buffer.from(asUint8Array(value)).toString('base64url'))

export const getSha256Hash = (value: Uint8Array): Uint8Array => new Uint8Array(createHash('sha256').update(value).digest())

export const getPaddedBytes = (padSize: number, value: internal.primitives.StubBytesCompat): bytes => {
  const uint8ArrayValue = asUint8Array(value)
  const result = new Uint8Array(padSize + uint8ArrayValue.length)
  result.set([...Array(padSize).fill(0x00), ...uint8ArrayValue])
  return Bytes(result)
}

export const intToBytes = (value: internal.primitives.StubBigUintCompat): internal.primitives.BytesCls =>
  internal.primitives.BigUintCls.fromCompat(value).toBytes()

export const abiAsBytes = (value: ABIValue) => {
  if (Array.isArray(value) && value.every((i) => typeof i === 'number')) {
    return Bytes(new Uint8Array(value))
  }
  if (value instanceof Uint8Array) {
    return Bytes(value)
  }
  if (typeof value === 'string') {
    return Bytes(value)
  }
  throw new Error(`Value cannot be converted to bytes`)
}
