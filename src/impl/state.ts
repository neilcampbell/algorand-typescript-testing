import {
  Account,
  Application,
  BoxMap as BoxMapType,
  BoxRef as BoxRefType,
  Box as BoxType,
  Bytes,
  bytes,
  GlobalStateOptions,
  GlobalState as GlobalStateType,
  internal,
  LocalStateForAccount,
  LocalState as LocalStateType,
  uint64,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
import { AccountMap } from '../collections/custom-key-map'
import { MAX_BOX_SIZE } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes, asNumber, toBytes } from '../util'

export class GlobalStateCls<ValueType> {
  private readonly _type: string = GlobalStateCls.name

  #value: ValueType | undefined
  key: bytes | undefined

  get hasKey(): boolean {
    return this.key !== undefined && this.key.length > 0
  }

  delete: () => void = () => {
    if (this.#value instanceof internal.primitives.Uint64Cls) {
      this.#value = Uint64(0) as ValueType
    } else {
      this.#value = undefined
    }
  }

  static [Symbol.hasInstance](x: unknown): x is GlobalStateCls<unknown> {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'] === GlobalStateCls.name
  }

  get value(): ValueType {
    if (this.#value === undefined) {
      throw new internal.errors.AssertError('value is not set')
    }
    return this.#value
  }

  set value(v: ValueType) {
    this.#value = v
  }

  get hasValue(): boolean {
    return this.#value !== undefined
  }

  constructor(key?: bytes | string, value?: ValueType) {
    this.key = key !== undefined ? asBytes(key) : undefined
    this.#value = value
  }
}

export class LocalStateCls<ValueType> {
  #value: ValueType | undefined
  delete: () => void = () => {
    if (this.#value instanceof internal.primitives.Uint64Cls) {
      this.#value = Uint64(0) as ValueType
    } else {
      this.#value = undefined
    }
  }
  get value(): ValueType {
    if (this.#value === undefined) {
      throw new internal.errors.AssertError('value is not set')
    }
    return this.#value
  }

  set value(v: ValueType) {
    this.#value = v
  }

  get hasValue(): boolean {
    return this.#value !== undefined
  }
}

export class LocalStateMapCls<ValueType> {
  #value = new AccountMap<LocalStateCls<ValueType>>()

  getValue(account: Account): LocalStateCls<ValueType> {
    if (!this.#value.has(account)) {
      this.#value.set(account, new LocalStateCls<ValueType>())
    }
    return this.#value.getOrFail(account)!
  }
}

export function GlobalState<ValueType>(options?: GlobalStateOptions<ValueType>): GlobalStateType<ValueType> {
  return new GlobalStateCls(options?.key, options?.initialValue)
}

export function LocalState<ValueType>(options?: { key?: bytes | string }): LocalStateType<ValueType> {
  function localStateInternal(account: Account): LocalStateForAccount<ValueType> {
    return localStateInternal.map.getValue(account)
  }
  localStateInternal.key = options?.key
  localStateInternal.hasKey = options?.key !== undefined && options.key.length > 0
  localStateInternal.map = new LocalStateMapCls<ValueType>()
  return localStateInternal
}

export class BoxCls<TValue> {
  #key: bytes | undefined
  #app: Application

  private readonly _type: string = BoxCls.name

  static [Symbol.hasInstance](x: unknown): x is BoxCls<unknown> {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'] === BoxCls.name
  }

  constructor(key?: internal.primitives.StubBytesCompat) {
    this.#key = key ? asBytes(key) : undefined
    this.#app = lazyContext.activeApplication
  }

  get value(): TValue {
    if (!this.exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    return lazyContext.ledger.getBox(this.#app, this.key)
  }
  set value(v: TValue) {
    lazyContext.ledger.setBox(this.#app, this.key, v)
  }

  get hasKey(): boolean {
    return this.#key !== undefined && this.#key.length > 0
  }

  get key(): bytes {
    if (this.#key === undefined || this.#key.length === 0) {
      throw new internal.errors.InternalError('Box key is empty')
    }
    return this.#key
  }

  set key(key: internal.primitives.StubBytesCompat) {
    this.#key = asBytes(key)
  }

  get exists(): boolean {
    return lazyContext.ledger.boxExists(this.#app, this.key)
  }

  get length(): uint64 {
    if (!this.exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    return toBytes(this.value).length
  }

  get(options: { default: TValue }): TValue {
    const [value, exists] = this.maybe()
    return exists ? value : options.default
  }

  delete(): boolean {
    return lazyContext.ledger.deleteBox(this.#app, this.key)
  }

  maybe(): readonly [TValue, boolean] {
    return [lazyContext.ledger.getBox(this.#app, this.key), lazyContext.ledger.boxExists(this.#app, this.key)]
  }
}

export class BoxMapCls<TKey, TValue> {
  #keyPrefix: bytes | undefined
  #app: Application

  private readonly _type: string = BoxMapCls.name

  static [Symbol.hasInstance](x: unknown): x is BoxMapCls<unknown, unknown> {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'] === BoxMapCls.name
  }

  constructor(keyPrefix?: internal.primitives.StubBytesCompat) {
    this.#keyPrefix = keyPrefix ? asBytes(keyPrefix) : undefined
    this.#app = lazyContext.activeApplication
  }

  get hasKeyPrefix(): boolean {
    return this.#keyPrefix !== undefined && this.#keyPrefix.length > 0
  }

  get keyPrefix(): bytes {
    if (this.#keyPrefix === undefined || this.#keyPrefix.length === 0) {
      throw new internal.errors.InternalError('Box key prefix is empty')
    }
    return this.#keyPrefix
  }

  set keyPrefix(keyPrefix: internal.primitives.StubBytesCompat) {
    this.#keyPrefix = asBytes(keyPrefix)
  }

  get(key: TKey, options?: { default: TValue }): TValue {
    const [value, exists] = this.maybe(key)
    if (!exists && options === undefined) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    return exists ? value : options!.default
  }

  set(key: TKey, value: TValue): void {
    lazyContext.ledger.setBox(this.#app, this.getFullKey(key), value)
  }

  delete(key: TKey): boolean {
    return lazyContext.ledger.deleteBox(this.#app, this.getFullKey(key))
  }

  has(key: TKey): boolean {
    return lazyContext.ledger.boxExists(this.#app, this.getFullKey(key))
  }

  maybe(key: TKey): readonly [TValue, boolean] {
    const fullKey = this.getFullKey(key)
    return [lazyContext.ledger.getBox(this.#app, fullKey), lazyContext.ledger.boxExists(this.#app, fullKey)]
  }

  length(key: TKey): uint64 {
    return toBytes(this.get(key)).length
  }

  private getFullKey(key: TKey): bytes {
    return this.keyPrefix.concat(toBytes(key))
  }
}

export class BoxRefCls {
  #key: bytes | undefined
  #app: Application

  private readonly _type: string = BoxRefCls.name

  static [Symbol.hasInstance](x: unknown): x is BoxRefCls {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'] === BoxRefCls.name
  }

  constructor(key?: internal.primitives.StubBytesCompat) {
    this.#key = key ? asBytes(key) : undefined
    this.#app = lazyContext.activeApplication
  }

  get hasKey(): boolean {
    return this.#key !== undefined && this.#key.length > 0
  }

  get key(): bytes {
    if (this.#key === undefined || this.#key.length === 0) {
      throw new internal.errors.InternalError('Box key is empty')
    }
    return this.#key
  }

  set key(key: internal.primitives.StubBytesCompat) {
    this.#key = asBytes(key)
  }

  get value(): bytes {
    return lazyContext.ledger.getBox(this.#app, this.key)
  }

  get exists(): boolean {
    return lazyContext.ledger.boxExists(this.#app, this.key)
  }

  create(options: { size: internal.primitives.StubUint64Compat }): boolean {
    const size = asNumber(options.size)
    if (size > MAX_BOX_SIZE) {
      throw new internal.errors.InternalError(`Box size cannot exceed ${MAX_BOX_SIZE}`)
    }
    const [content, exists] = this.maybe()
    if (exists && content.length !== size) {
      throw new internal.errors.InternalError('Box already exists with a different size')
    }
    if (exists) {
      return false
    }
    lazyContext.ledger.setBox(this.#app, this.key, Bytes(Array(size).fill(0)))
    return true
  }

  get(options: { default: internal.primitives.StubBytesCompat }): bytes {
    const [value, exists] = this.maybe()
    return exists ? value : asBytes(options.default)
  }

  put(value: internal.primitives.StubBytesCompat): void {
    const bytesValue = asBytes(value)
    const [content, exists] = this.maybe()
    if (exists && content.length !== bytesValue.length) {
      throw new internal.errors.InternalError('Box already exists with a different size')
    }
    lazyContext.ledger.setBox(this.#app, this.key, bytesValue)
  }

  splice(
    start: internal.primitives.StubUint64Compat,
    length: internal.primitives.StubUint64Compat,
    value: internal.primitives.StubBytesCompat,
  ): void {
    const [content, exists] = this.maybe()
    const startNumber = asNumber(start)
    const lengthNumber = asNumber(length)
    const valueBytes = asBytes(value)
    if (!exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    if (startNumber > content.length) {
      throw new internal.errors.InternalError('Start index exceeds box size')
    }
    const end = Math.min(startNumber + lengthNumber, content.length)
    let updatedContent = content.slice(0, startNumber).concat(valueBytes).concat(content.slice(end))

    if (updatedContent.length > content.length) {
      updatedContent = updatedContent.slice(0, content.length)
    } else if (updatedContent.length < content.length) {
      updatedContent = updatedContent.concat(Bytes(Array(content.length - updatedContent.length).fill(0)))
    }
    lazyContext.ledger.setBox(this.#app, this.key, updatedContent)
  }

  replace(start: internal.primitives.StubUint64Compat, value: internal.primitives.StubBytesCompat): void {
    const [content, exists] = this.maybe()
    const startNumber = asNumber(start)
    const valueBytes = asBytes(value)
    if (!exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    if (startNumber + valueBytes.length > content.length) {
      throw new internal.errors.InternalError('Replacement content exceeds box size')
    }
    const updatedContent = content
      .slice(0, startNumber)
      .concat(valueBytes)
      .concat(content.slice(startNumber + valueBytes.length))
    lazyContext.ledger.setBox(this.#app, this.key, updatedContent)
  }

  extract(start: internal.primitives.StubUint64Compat, length: internal.primitives.StubUint64Compat): bytes {
    const [content, exists] = this.maybe()
    const startNumber = asNumber(start)
    const lengthNumber = asNumber(length)
    if (!exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    if (startNumber + lengthNumber > content.length) {
      throw new internal.errors.InternalError('Index out of bounds')
    }
    return content.slice(startNumber, startNumber + lengthNumber)
  }
  delete(): boolean {
    return lazyContext.ledger.deleteBox(this.#app, this.key)
  }

  resize(newSize: uint64): void {
    const newSizeNumber = asNumber(newSize)
    if (newSizeNumber > MAX_BOX_SIZE) {
      throw new internal.errors.InternalError(`Box size cannot exceed ${MAX_BOX_SIZE}`)
    }
    const [content, exists] = this.maybe()
    if (!exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    let updatedContent
    if (newSizeNumber > content.length) {
      updatedContent = content.concat(Bytes(Array(newSizeNumber - content.length).fill(0)))
    } else {
      updatedContent = content.slice(0, newSize)
    }
    lazyContext.ledger.setBox(this.#app, this.key, updatedContent)
  }

  maybe(): readonly [bytes, boolean] {
    return [lazyContext.ledger.getBox(this.#app, this.key), lazyContext.ledger.boxExists(this.#app, this.key)]
  }

  get length(): uint64 {
    const [value, exists] = this.maybe()
    if (!exists) {
      throw new internal.errors.InternalError('Box has not been created')
    }
    return value.length
  }
}

export function Box<TValue>(options?: { key: bytes | string }): BoxType<TValue> {
  return new BoxCls<TValue>(options?.key)
}

export function BoxMap<TKey, TValue>(options?: { keyPrefix: bytes | string }): BoxMapType<TKey, TValue> {
  return new BoxMapCls<TKey, TValue>(options?.keyPrefix)
}

export function BoxRef(options?: { key: bytes | string }): BoxRefType {
  return new BoxRefCls(options?.key)
}
