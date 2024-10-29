import { Bytes, bytes, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { encodingUtil } from '@algorandfoundation/puya-ts'
import type { GenericTypeInfo } from '../encoders'

export abstract class BytesBackedCls {
  #value: bytes
  // #typeInfo: GenericTypeInfo | undefined

  get bytes() {
    return this.#value
  }
  constructor(value: bytes, _typeInfo?: GenericTypeInfo) {
    this.#value = value
    // this.#typeInfo = typeInfo
  }

  static fromBytes<T extends BytesBackedCls>(
    this: { new (v: bytes, typeInfo?: GenericTypeInfo): T },
    value: Uint8Array,
    typeInfo?: GenericTypeInfo,
  ) {
    return new this(Bytes(value), typeInfo)
  }
}

export abstract class Uint64BackedCls {
  #value: uint64

  get uint64() {
    return this.#value
  }

  constructor(value: uint64) {
    this.#value = value
  }

  static fromBytes<T extends Uint64BackedCls>(this: { new (v: uint64): T }, value: Uint8Array) {
    const uint64Value = Uint64(encodingUtil.uint8ArrayToBigInt(value))
    return new this(uint64Value)
  }
}
