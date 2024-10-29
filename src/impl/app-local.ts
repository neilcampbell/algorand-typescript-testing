import { Account, Application, Bytes, bytes, internal, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes } from '../util'
import { getAccount } from './acct-params'
import { getApp } from './app-params'

export const AppLocal: internal.opTypes.AppLocalType = {
  delete: function (a: Account | internal.primitives.StubUint64Compat, b: internal.primitives.StubBytesCompat): void {
    const app = lazyContext.activeApplication
    const account = getAccount(a)
    lazyContext.ledger.setLocalState(app, account, b, undefined)
  },
  getBytes: function (a: Account | internal.primitives.StubUint64Compat, b: internal.primitives.StubBytesCompat): bytes {
    const account = getAccount(a)
    return this.getExBytes(account, 0, asBytes(b))[0]
  },
  getUint64: function (a: Account | internal.primitives.StubUint64Compat, b: internal.primitives.StubBytesCompat): uint64 {
    const account = getAccount(a)
    return this.getExUint64(account, 0, asBytes(b))[0]
  },
  getExBytes: function (
    a: Account | internal.primitives.StubUint64Compat,
    b: Application | internal.primitives.StubUint64Compat,
    c: internal.primitives.StubBytesCompat,
  ): readonly [bytes, boolean] {
    const app = getApp(b)
    const account = getAccount(a)
    if (app === undefined || account === undefined) {
      return [Bytes(), false]
    }
    const [state, exists] = lazyContext.ledger.getLocalState(app, account, c)
    if (!exists) {
      return [Bytes(), false]
    }
    return [state!.value as bytes, exists]
  },
  getExUint64: function (
    a: Account | internal.primitives.StubUint64Compat,
    b: Application | internal.primitives.StubUint64Compat,
    c: internal.primitives.StubBytesCompat,
  ): readonly [uint64, boolean] {
    const app = getApp(b)
    const account = getAccount(a)
    if (app === undefined || account === undefined) {
      return [Uint64(0), false]
    }
    const [state, exists] = lazyContext.ledger.getLocalState(app, account, c)
    if (!exists) {
      return [Uint64(0), false]
    }
    return [state!.value as uint64, exists]
  },
  put: function (a: Account | internal.primitives.StubUint64Compat, b: internal.primitives.StubBytesCompat, c: uint64 | bytes): void {
    const app = lazyContext.activeApplication
    const account = getAccount(a)
    lazyContext.ledger.setLocalState(app, account, b, c)
  },
}
