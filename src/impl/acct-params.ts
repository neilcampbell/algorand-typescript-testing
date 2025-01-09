import { Account, Application, gtxn, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asMaybeUint64Cls } from '../util'
import { getApp } from './app-params'

export const getAccount = (acct: Account | internal.primitives.StubUint64Compat): Account => {
  const acctId = asMaybeUint64Cls(acct)
  if (acctId !== undefined) {
    const activeTxn = lazyContext.activeGroup.activeTransaction
    return (activeTxn as gtxn.ApplicationTxn).accounts(acctId.asAlgoTs())
  }
  return acct as Account
}

export const balance = (a: Account | internal.primitives.StubUint64Compat): uint64 => {
  const acct = getAccount(a)
  return acct.balance
}

export const minBalance = (a: Account | internal.primitives.StubUint64Compat): uint64 => {
  const acct = getAccount(a)
  return acct.minBalance
}

export const appOptedIn = (
  a: Account | internal.primitives.StubUint64Compat,
  b: Application | internal.primitives.StubUint64Compat,
): boolean => {
  const account = getAccount(a)
  const app = getApp(b)

  if (account === undefined || app === undefined) {
    return false
  }
  return account.isOptedIn(app)
}

export const AcctParams: internal.opTypes.AcctParamsType = {
  acctBalance(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.balance, acct.balance !== 0]
  },
  acctMinBalance(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.minBalance, acct.balance !== 0]
  },
  acctAuthAddr(a: Account | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const acct = getAccount(a)
    return [acct.authAddress, acct.balance !== 0]
  },
  acctTotalNumUint(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalNumUint, acct.balance !== 0]
  },
  acctTotalNumByteSlice(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalNumByteSlice, acct.balance !== 0]
  },
  acctTotalExtraAppPages(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalExtraAppPages, acct.balance !== 0]
  },
  acctTotalAppsCreated(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAppsCreated, acct.balance !== 0]
  },
  acctTotalAppsOptedIn(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAppsOptedIn, acct.balance !== 0]
  },
  acctTotalAssetsCreated(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAssetsCreated, acct.balance !== 0]
  },
  acctTotalAssets(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalAssets, acct.balance !== 0]
  },
  acctTotalBoxes(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalBoxes, acct.balance !== 0]
  },
  acctTotalBoxBytes(a: Account | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const acct = getAccount(a)
    return [acct.totalBoxBytes, acct.balance !== 0]
  },
  // TODO: implement v11 methods
  acctIncentiveEligible: function (_a: Account | uint64): readonly [boolean, boolean] {
    throw new Error('Function not implemented.')
  },
  acctLastProposed: function (_a: Account | uint64): readonly [uint64, boolean] {
    throw new Error('Function not implemented.')
  },
  acctLastHeartbeat: function (_a: Account | uint64): readonly [uint64, boolean] {
    throw new Error('Function not implemented.')
  },
}
