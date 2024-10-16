import { Application, Bytes, bytes, internal, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes } from '../util'
import { getApp } from './app-params'

export const AppGlobal: internal.opTypes.AppGlobalType = {
  delete: function (a: internal.primitives.StubBytesCompat): void {
    lazyContext.ledger.setGlobalState(lazyContext.activeApplication, a, undefined)
  },
  getBytes: function (a: internal.primitives.StubBytesCompat): bytes {
    return this.getExBytes(0, asBytes(a))[0]
  },
  getUint64: function (a: internal.primitives.StubBytesCompat): uint64 {
    return this.getExUint64(0, asBytes(a))[0]
  },
  getExBytes: function (
    a: Application | internal.primitives.StubUint64Compat,
    b: internal.primitives.StubBytesCompat,
  ): readonly [bytes, boolean] {
    const app = getApp(a)
    if (app === undefined) {
      return [Bytes(), false]
    }
    const [state, exists] = lazyContext.ledger.getGlobalState(app, b)
    if (!exists) {
      return [Bytes(), false]
    }
    return [state!.value as bytes, exists]
  },
  getExUint64: function (
    a: Application | internal.primitives.StubUint64Compat,
    b: internal.primitives.StubBytesCompat,
  ): readonly [uint64, boolean] {
    const app = getApp(a)
    if (app === undefined) {
      return [Uint64(0), false]
    }
    const [state, exists] = lazyContext.ledger.getGlobalState(app, b)
    if (!exists) {
      return [Uint64(0), false]
    }
    return [state!.value as uint64, exists]
  },
  put: function (
    a: internal.primitives.StubBytesCompat,
    b: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat,
  ): void {
    lazyContext.ledger.setGlobalState(lazyContext.activeApplication, a, b)
  },
}
