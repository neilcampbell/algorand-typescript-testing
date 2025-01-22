import type {
  BaseContract,
  bytes,
  LocalStateForAccount,
  Account as AccountType,
  Application as ApplicationType,
  Asset as AssetType,
} from '@algorandfoundation/algorand-typescript'
import { internal } from '@algorandfoundation/algorand-typescript'
import { AccountMap, Uint64Map } from '../collections/custom-key-map'
import { MAX_UINT64 } from '../constants'
import { BlockData } from '../impl/block'
import { GlobalData } from '../impl/global'
import type { ApplicationData, AssetData } from '../impl/reference'
import { Account, AccountData, Application, Asset, AssetHolding } from '../impl/reference'
import type { GlobalStateCls } from '../impl/state'
import { VoterData } from '../impl/voter-params'
import { asBigInt, asMaybeBytesCls, asMaybeUint64Cls, asUint64, asUint64Cls, iterBigInt } from '../util'

export class LedgerContext {
  appIdIter = iterBigInt(1001n, MAX_UINT64)
  assetIdIter = iterBigInt(1001n, MAX_UINT64)
  applicationDataMap = new Uint64Map<ApplicationData>()
  appIdContractMap = new Uint64Map<BaseContract>()
  accountDataMap = new AccountMap<AccountData>()
  assetDataMap = new Uint64Map<AssetData>()
  voterDataMap = new AccountMap<VoterData>()
  blocks = new Uint64Map<BlockData>()
  globalData = new GlobalData()
  onlineStake = 0

  /* @internal */
  addAppIdContractMap(appId: internal.primitives.StubUint64Compat, contract: BaseContract): void {
    this.appIdContractMap.set(appId, contract)
  }

  getAccount(address: AccountType): AccountType {
    if (this.accountDataMap.has(address)) {
      return Account(address.bytes)
    }
    throw internal.errors.internalError('Unknown account, check correct testing context is active')
  }

  getAsset(assetId: internal.primitives.StubUint64Compat): AssetType {
    if (this.assetDataMap.has(assetId)) {
      return Asset(asUint64(assetId))
    }
    throw internal.errors.internalError('Unknown asset, check correct testing context is active')
  }

  getApplication(applicationId: internal.primitives.StubUint64Compat): ApplicationType {
    if (this.applicationDataMap.has(applicationId)) {
      return Application(asUint64(applicationId))
    }
    throw internal.errors.internalError('Unknown application, check correct testing context is active')
  }

  getApplicationForContract(contract: BaseContract): ApplicationType {
    for (const [appId, c] of this.appIdContractMap) {
      if (c === contract) {
        if (this.applicationDataMap.has(appId)) {
          return Application(asUint64(appId))
        }
      }
    }
    throw internal.errors.internalError('Unknown contract, check correct testing context is active')
  }

  getApplicationForApprovalProgram(approvalProgram: bytes | readonly bytes[] | undefined): ApplicationType | undefined {
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
   * AccountType will also be opted-in to asset
   * @param account
   * @param assetId
   * @param balance
   * @param frozen
   */
  updateAssetHolding(
    account: AccountType,
    assetId: internal.primitives.StubUint64Compat | AssetType,
    balance?: internal.primitives.StubUint64Compat,
    frozen?: boolean,
  ): void {
    const id = asMaybeUint64Cls(assetId) ?? asUint64Cls((assetId as AssetType).id)
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

  patchAccountData(account: AccountType, data: Partial<AccountData>) {
    const accountData = this.accountDataMap.get(account) ?? new AccountData()
    this.accountDataMap.set(account, {
      ...accountData,
      ...data,
      account: {
        ...accountData?.account,
        ...data.account,
      },
    })
  }

  patchVoterData(account: AccountType, data: Partial<VoterData>) {
    const voterData = this.voterDataMap.get(account) ?? new VoterData()
    this.voterDataMap.set(account, {
      ...voterData,
      ...data,
    })
  }

  patchBlockData(index: internal.primitives.StubUint64Compat, data: Partial<BlockData>): void {
    const i = asUint64(index)
    const blockData = this.blocks.get(i) ?? new BlockData()
    this.blocks.set(i, {
      ...blockData,
      ...data,
    })
  }

  getBlockData(index: internal.primitives.StubUint64Compat): BlockData {
    const i = asBigInt(index)
    if (this.blocks.has(i)) {
      return this.blocks.get(i)!
    }
    throw internal.errors.internalError(`Block ${i} not set`)
  }

  getGlobalState(app: ApplicationType, key: internal.primitives.StubBytesCompat): [GlobalStateCls<unknown>, true] | [undefined, false] {
    const appData = this.applicationDataMap.get(app.id)
    if (!appData?.application.globalStates.has(key)) {
      return [undefined, false]
    }
    return [appData.application.globalStates.getOrFail(key), true]
  }

  setGlobalState(
    app: ApplicationType,
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
    app: ApplicationType,
    account: AccountType,
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
    app: ApplicationType,
    account: AccountType,
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

  getBox(app: ApplicationType, key: internal.primitives.StubBytesCompat): Uint8Array {
    const appData = this.applicationDataMap.getOrFail(app.id)
    return appData.application.boxes.get(key) ?? new Uint8Array()
  }

  setBox(app: ApplicationType, key: internal.primitives.StubBytesCompat, value: Uint8Array): void {
    const appData = this.applicationDataMap.getOrFail(app.id)
    appData.application.boxes.set(key, value)
  }

  deleteBox(app: ApplicationType, key: internal.primitives.StubBytesCompat): boolean {
    const appData = this.applicationDataMap.getOrFail(app.id)
    return appData.application.boxes.delete(key)
  }

  boxExists(app: ApplicationType, key: internal.primitives.StubBytesCompat): boolean {
    const appData = this.applicationDataMap.getOrFail(app.id)
    return appData.application.boxes.has(key)
  }
}
