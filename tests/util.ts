import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Bytes, internal } from '@algorandfoundation/algorand-typescript'
import { createHash } from 'crypto'
import { asUint8Array } from '../src/util'

export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize)
  arr.forEach((v, i) => (paddedUint8Array[padSize + i] = v))
  return paddedUint8Array
}

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
