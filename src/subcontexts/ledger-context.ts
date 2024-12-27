import { Account, Application, Asset, BaseContract, bytes, internal, LocalStateForAccount } from '@algorandfoundation/algorand-typescript'
import { AccountMap, Uint64Map } from '../collections/custom-key-map'
import { MAX_UINT64 } from '../constants'
import { AccountData, AssetHolding } from '../impl/account'
import { ApplicationData } from '../impl/application'
import { AssetData } from '../impl/asset'
import { GlobalData } from '../impl/global'
import { GlobalStateCls } from '../impl/state'
import { asBigInt, asMaybeBytesCls, asMaybeUint64Cls, asUint64, asUint64Cls, iterBigInt } from '../util'

interface BlockData {
  seed: bigint
  timestamp: bigint
}

export class LedgerContext {
  appIdIter = iterBigInt(1001n, MAX_UINT64)
  assetIdIter = iterBigInt(1001n, MAX_UINT64)
  applicationDataMap = new Uint64Map<ApplicationData>()
  appIdContractMap = new Uint64Map<BaseContract>()
  accountDataMap = new AccountMap<AccountData>()
  assetDataMap = new Uint64Map<AssetData>()
  blocks = new Uint64Map<BlockData>()
  globalData = new GlobalData()

  addAppIdContractMap(appId: internal.primitives.StubUint64Compat, contract: BaseContract): void {
    this.appIdContractMap.set(appId, contract)
  }

  getAccount(address: Account): Account {
    if (this.accountDataMap.has(address)) {
      return Account(address.bytes)
    }
    throw internal.errors.internalError('Unknown account, check correct testing context is active')
  }

  getAsset(assetId: internal.primitives.StubUint64Compat): Asset {
    if (this.assetDataMap.has(assetId)) {
      return Asset(asUint64(assetId))
    }
    throw internal.errors.internalError('Unknown asset, check correct testing context is active')
  }

  getApplication(applicationId: internal.primitives.StubUint64Compat): Application {
    if (this.applicationDataMap.has(applicationId)) {
      return Application(asUint64(applicationId))
    }
    throw internal.errors.internalError('Unknown application, check correct testing context is active')
  }

  getApplicationForContract(contract: BaseContract): Application {
    for (const [appId, c] of this.appIdContractMap) {
      if (c === contract) {
        if (this.applicationDataMap.has(appId)) {
          return Application(asUint64(appId))
        }
      }
    }
    throw internal.errors.internalError('Unknown contract, check correct testing context is active')
  }

  getApplicationForApprovalProgram(approvalProgram: bytes | readonly bytes[] | undefined): Application | undefined {
    if (approvalProgram === undefined) {
      return undefined
    }
    const entries = this.applicationDataMap.entries()
    let next = entries.next()
    let found = false
    while (!next.done && !found) {
      found = next.value[1].application.approvalProgram === approvalProgram
      if (!found) {
        next = entries.next()
      }
    }
    if (found && next?.value) {
      const appId = asUint64(next.value[0])
      if (this.applicationDataMap.has(appId)) {
        return Application(appId)
      }
    }
    return undefined
  }

  /**
   * Update asset holdings for account, only specified values will be updated.
   * Account will also be opted-in to asset
   * @param account
   * @param assetId
   * @param balance
   * @param frozen
   */
  updateAssetHolding(
    account: Account,
    assetId: internal.primitives.StubUint64Compat | Asset,
    balance?: internal.primitives.StubUint64Compat,
    frozen?: boolean,
  ): void {
    const id = asMaybeUint64Cls(assetId) ?? asUint64Cls((assetId as Asset).id)
    const accountData = this.accountDataMap.get(account)!
    const asset = this.assetDataMap.get(id)!
    const holding = accountData.optedAssets.get(id) ?? new AssetHolding(0n, asset.defaultFrozen)
    if (balance !== undefined) holding.balance = asUint64(balance)
    if (frozen !== undefined) holding.frozen = frozen
    accountData.optedAssets.set(id, holding)
  }

  patchGlobalData(data: Partial<GlobalData>) {
    this.globalData = {
      ...this.globalData,
      ...data,
    }
  }

  setBlock(
    index: internal.primitives.StubUint64Compat,
    seed: internal.primitives.StubUint64Compat,
    timestamp: internal.primitives.StubUint64Compat,
  ): void {
    const i = asBigInt(index)
    const s = asBigInt(seed)
    const t = asBigInt(timestamp)

    this.blocks.set(i, { seed: s, timestamp: t })
  }

  getBlockContent(index: internal.primitives.StubUint64Compat): BlockData {
    const i = asBigInt(index)
    if (this.blocks.has(i)) {
      return this.blocks.get(i)!
    }
    throw internal.errors.internalError(`Block ${i} not set`)
  }

  getGlobalState(app: Application, key: internal.primitives.StubBytesCompat): [GlobalStateCls<unknown>, true] | [undefined, false] {
    const appData = this.applicationDataMap.get(app.id)
    if (!appData?.application.globalStates.has(key)) {
      return [undefined, false]
    }
    return [appData.application.globalStates.getOrFail(key), true]
  }

  setGlobalState(
    app: Application,
    key: internal.primitives.StubBytesCompat,
    value: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat | undefined,
  ): void {
    const appData = this.applicationDataMap.getOrFail(app.id)
    const globalState = appData.application.globalStates.getOrFail(key)
    if (value === undefined) {
      globalState.delete()
    } else {
      globalState.value = asMaybeUint64Cls(value) ?? asMaybeBytesCls(value)
    }
  }

  getLocalState(
    app: Application,
    account: Account,
    key: internal.primitives.StubBytesCompat,
  ): [LocalStateForAccount<unknown>, true] | [undefined, false] {
    const appData = this.applicationDataMap.get(app.id)
    if (!appData?.application.localStates.has(key)) {
      return [undefined, false]
    }
    const localState = appData.application.localStates.getOrFail(key)
    return [localState(account), true]
  }

  setLocalState(
    app: Application,
    account: Account,
    key: internal.primitives.StubBytesCompat,
    value: internal.primitives.StubUint64Compat | internal.primitives.StubBytesCompat | undefined,
  ): void {
    const appData = this.applicationDataMap.getOrFail(app.id)
    const localState = appData.application.localStates.getOrFail(key)
    const accountLocalState = localState(account)
    if (value === undefined) {
      accountLocalState.delete()
    } else {
      accountLocalState.value = asMaybeUint64Cls(value) ?? asMaybeBytesCls(value)
    }
  }

  getBox(app: Application, key: internal.primitives.StubBytesCompat): Uint8Array {
    const appData = this.applicationDataMap.getOrFail(app.id)
    return appData.application.boxes.get(key) ?? new Uint8Array()
  }

  setBox(app: Application, key: internal.primitives.StubBytesCompat, value: Uint8Array): void {
    const appData = this.applicationDataMap.getOrFail(app.id)
    appData.application.boxes.set(key, value)
  }

  deleteBox(app: Application, key: internal.primitives.StubBytesCompat): boolean {
    const appData = this.applicationDataMap.getOrFail(app.id)
    return appData.application.boxes.delete(key)
  }

  boxExists(app: Application, key: internal.primitives.StubBytesCompat): boolean {
    const appData = this.applicationDataMap.getOrFail(app.id)
    return appData.application.boxes.has(key)
  }
}
