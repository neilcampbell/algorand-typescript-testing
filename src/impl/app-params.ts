import {
  type Account as AccountType,
  type Application as ApplicationType,
  Bytes,
  bytes,
  gtxn,
  internal,
  Uint64,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asMaybeUint64Cls, asUint64 } from '../util'
import { Account } from './reference'

const resolveAppIndex = (appIdOrIndex: internal.primitives.StubUint64Compat): uint64 => {
  const input = asUint64(appIdOrIndex)
  if (input >= 1001) {
    return input
  }
  const txn = lazyContext.activeGroup.activeTransaction as gtxn.ApplicationTxn
  return txn.apps(input).id
}

export const getApp = (app: ApplicationType | internal.primitives.StubUint64Compat): ApplicationType | undefined => {
  try {
    const appId = asMaybeUint64Cls(app)
    if (appId !== undefined) {
      return lazyContext.ledger.getApplication(resolveAppIndex(appId))
    }
    return app as ApplicationType
  } catch {
    return undefined
  }
}

export const AppParams: internal.opTypes.AppParamsType = {
  appApprovalProgram(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const app = getApp(a)
    return app === undefined ? [Bytes(), false] : [app.approvalProgram, true]
  },
  appClearStateProgram(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const app = getApp(a)
    return app === undefined ? [Bytes(), false] : [app.clearStateProgram, true]
  },
  appGlobalNumUint(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = getApp(a)
    return app === undefined ? [Uint64(0), false] : [app.globalNumUint, true]
  },
  appGlobalNumByteSlice(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = getApp(a)
    return app === undefined ? [Uint64(0), false] : [app.globalNumBytes, true]
  },
  appLocalNumUint(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = getApp(a)
    return app === undefined ? [Uint64(0), false] : [app.localNumUint, true]
  },
  appLocalNumByteSlice(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = getApp(a)
    return app === undefined ? [Uint64(0), false] : [app.localNumBytes, true]
  },
  appExtraProgramPages(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const app = getApp(a)
    return app === undefined ? [Uint64(0), false] : [app.extraProgramPages, true]
  },
  appCreator(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const app = getApp(a)
    return app === undefined ? [Account(), false] : [app.creator, true]
  },
  appAddress(a: ApplicationType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const app = getApp(a)
    return app === undefined ? [Account(), false] : [app.address, true]
  },
}
