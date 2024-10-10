import { bytes, uint64 } from '@algorandfoundation/algorand-typescript'

export abstract class BytesBackedCls {
  #value: bytes

  get bytes() {
    return this.#value
  }
  constructor(value: bytes) {
    this.#value = value
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
}
