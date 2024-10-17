import {
  Account,
  bytes,
  GlobalState,
  GlobalStateOptions,
  internal,
  LocalState,
  LocalStateForAccount,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
import { AccountMap } from '../collections/custom-key-map'
import { asBytes } from '../util'

export class GlobalStateCls<ValueType> {
  private readonly _type: string = GlobalStateCls.name

  #value: ValueType | undefined
  key: bytes | undefined

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

export function createGlobalState<ValueType>(options?: GlobalStateOptions<ValueType>): GlobalState<ValueType> {
  return new GlobalStateCls(options?.key, options?.initialValue)
}

export function createLocalState<ValueType>(options?: { key?: bytes | string }): LocalState<ValueType> {
  function localStateInternal(account: Account): LocalStateForAccount<ValueType> {
    return localStateInternal.map.getValue(account)
  }
  localStateInternal.key = options?.key
  localStateInternal.map = new LocalStateMapCls<ValueType>()
  return localStateInternal
}
