import { Account, Application, arc4, Asset, bytes, internal, itxn, TransactionType, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes, asBytesCls, asUint64, asUint64Cls } from '../util'
import { getApp } from './app-params'
import { getAsset } from './asset-params'
import { testInvariant } from '../errors'
import {
  ApplicationInnerTxn,
  AssetConfigInnerTxn,
  AssetFreezeInnerTxn,
  AssetTransferInnerTxn,
  KeyRegistrationInnerTxn,
  PaymentInnerTxn,
} from './inner-transactions'

export type InnerTxn =
  | itxn.PaymentInnerTxn
  | itxn.KeyRegistrationInnerTxn
  | itxn.AssetConfigInnerTxn
  | itxn.AssetTransferInnerTxn
  | itxn.AssetFreezeInnerTxn
  | itxn.ApplicationInnerTxn

export type InnerTxnFields = (
  | itxn.PaymentFields
  | itxn.KeyRegistrationFields
  | itxn.AssetConfigFields
  | itxn.AssetTransferFields
  | itxn.AssetFreezeFields
  | itxn.ApplicationCallFields
) & { type?: TransactionType }

const getLastItxn = <T extends InnerTxn>(): T => {
  const innerTxnGroups = lazyContext.activeGroup.itxnGroups
  testInvariant(innerTxnGroups.length > 0 && innerTxnGroups[-1].length > 0, 'no previous inner transactions')
  return innerTxnGroups[-1][-1] as T
}

export const ITxn: internal.opTypes.ITxnType = {
  /**
   * 32 byte address
   */
  get sender(): Account {
    return getLastItxn().sender
  },
  /**
   * microalgos
   */
  get fee(): uint64 {
    return getLastItxn().fee
  },
  /**
   * round number
   */
  get firstValid(): uint64 {
    return getLastItxn().firstValid
  },
  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  get firstValidTime(): uint64 {
    return getLastItxn().firstValidTime
  },
  /**
   * round number
   */
  get lastValid(): uint64 {
    return getLastItxn().lastValid
  },
  /**
   * Any data up to 1024 bytes
   */
  get note(): bytes {
    return getLastItxn().note
  },
  /**
   * 32 byte lease value
   */
  get lease(): bytes {
    return getLastItxn().lease
  },
  /**
   * 32 byte address
   */
  get receiver(): Account {
    return getLastItxn<PaymentInnerTxn>().receiver
  },
  /**
   * microalgos
   */
  get amount(): uint64 {
    return getLastItxn<PaymentInnerTxn>().amount
  },
  /**
   * 32 byte address
   */
  get closeRemainderTo(): Account {
    return getLastItxn<PaymentInnerTxn>().closeRemainderTo
  },
  /**
   * 32 byte address
   */
  get votePk(): bytes {
    return getLastItxn<KeyRegistrationInnerTxn>().voteKey
  },
  /**
   * 32 byte address
   */
  get selectionPk(): bytes {
    return getLastItxn<KeyRegistrationInnerTxn>().selectionKey
  },
  /**
   * The first round that the participation key is valid.
   */
  get voteFirst(): uint64 {
    return getLastItxn<KeyRegistrationInnerTxn>().voteFirst
  },
  /**
   * The last round that the participation key is valid.
   */
  get voteLast(): uint64 {
    return getLastItxn<KeyRegistrationInnerTxn>().voteLast
  },
  /**
   * Dilution for the 2-level participation key
   */
  get voteKeyDilution(): uint64 {
    return getLastItxn<KeyRegistrationInnerTxn>().voteKeyDilution
  },
  /**
   * Transaction type as bytes
   */
  get type(): bytes {
    return asUint64Cls(getLastItxn().type).toBytes().asAlgoTs()
  },
  /**
   * Transaction type as integer
   */
  get typeEnum(): uint64 {
    return asUint64(getLastItxn().type)
  },
  /**
   * Asset ID
   */
  get xferAsset(): Asset {
    return getLastItxn<AssetTransferInnerTxn>().xferAsset
  },
  /**
   * value in Asset's units
   */
  get assetAmount(): uint64 {
    return getLastItxn<AssetTransferInnerTxn>().assetAmount
  },
  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  get assetSender(): Account {
    return getLastItxn<AssetTransferInnerTxn>().assetSender
  },
  /**
   * 32 byte address
   */
  get assetReceiver(): Account {
    return getLastItxn<AssetTransferInnerTxn>().assetReceiver
  },
  /**
   * 32 byte address
   */
  get assetCloseTo(): Account {
    return getLastItxn<AssetTransferInnerTxn>().assetCloseTo
  },
  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  get groupIndex(): uint64 {
    return getLastItxn().groupIndex
  },
  /**
   * The computed ID for this transaction. 32 bytes.
   */
  get txId(): bytes {
    return getLastItxn().txnId
  },
  /**
   * ApplicationID from ApplicationCall transaction
   */
  get applicationId(): Application {
    return getLastItxn<ApplicationInnerTxn>().appId
  },
  /**
   * ApplicationCall transaction on completion action
   */
  get onCompletion(): uint64 {
    const onCompletionStr = getLastItxn<ApplicationInnerTxn>().onCompletion
    return asUint64(arc4.OnCompleteAction[onCompletionStr])
  },
  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(a: internal.primitives.StubUint64Compat): bytes {
    return getLastItxn<ApplicationInnerTxn>().appArgs(asUint64(a))
  },
  /**
   * Number of ApplicationArgs
   */
  get numAppArgs(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numAppArgs
  },
  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(a: internal.primitives.StubUint64Compat): Account {
    return getLastItxn<ApplicationInnerTxn>().accounts(asUint64(a))
  },
  /**
   * Number of Accounts
   */
  get numAccounts(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numAccounts
  },
  /**
   * Approval program
   */
  get approvalProgram(): bytes {
    return getLastItxn<ApplicationInnerTxn>().approvalProgram
  },
  /**
   * Clear state program
   */
  get clearStateProgram(): bytes {
    return getLastItxn<ApplicationInnerTxn>().clearStateProgram
  },
  /**
   * 32 byte Sender's new AuthAddr
   */
  get rekeyTo(): Account {
    return getLastItxn().rekeyTo
  },
  /**
   * Asset ID in asset config transaction
   */
  get configAsset(): Asset {
    return getLastItxn<AssetConfigInnerTxn>().configAsset
  },
  /**
   * Total number of units of this asset created
   */
  get configAssetTotal(): uint64 {
    return getLastItxn<AssetConfigInnerTxn>().total
  },
  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  get configAssetDecimals(): uint64 {
    return getLastItxn<AssetConfigInnerTxn>().decimals
  },
  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  get configAssetDefaultFrozen(): boolean {
    return getLastItxn<AssetConfigInnerTxn>().defaultFrozen
  },
  /**
   * Unit name of the asset
   */
  get configAssetUnitName(): bytes {
    return getLastItxn<AssetConfigInnerTxn>().unitName
  },
  /**
   * The asset name
   */
  get configAssetName(): bytes {
    return getLastItxn<AssetConfigInnerTxn>().assetName
  },
  /**
   * URL
   */
  get configAssetUrl(): bytes {
    return getLastItxn<AssetConfigInnerTxn>().url
  },
  /**
   * 32 byte commitment to unspecified asset metadata
   */
  get configAssetMetadataHash(): bytes {
    return getLastItxn<AssetConfigInnerTxn>().metadataHash
  },
  /**
   * 32 byte address
   */
  get configAssetManager(): Account {
    return getLastItxn<AssetConfigInnerTxn>().manager
  },
  /**
   * 32 byte address
   */
  get configAssetReserve(): Account {
    return getLastItxn<AssetConfigInnerTxn>().reserve
  },
  /**
   * 32 byte address
   */
  get configAssetFreeze(): Account {
    return getLastItxn<AssetConfigInnerTxn>().freeze
  },
  /**
   * 32 byte address
   */
  get configAssetClawback(): Account {
    return getLastItxn<AssetConfigInnerTxn>().clawback
  },
  /**
   * Asset ID being frozen or un-frozen
   */
  get freezeAsset(): Asset {
    return getLastItxn<AssetFreezeInnerTxn>().freezeAsset
  },
  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  get freezeAssetAccount(): Account {
    return getLastItxn<AssetFreezeInnerTxn>().freezeAccount
  },
  /**
   * The new frozen value, 0 or 1
   */
  get freezeAssetFrozen(): boolean {
    return getLastItxn<AssetFreezeInnerTxn>().frozen
  },
  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(a: internal.primitives.StubUint64Compat): Asset {
    return getLastItxn<ApplicationInnerTxn>().assets(asUint64(a))
  },
  /**
   * Number of Assets
   */
  get numAssets(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numAssets
  },
  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(a: internal.primitives.StubUint64Compat): Application {
    return getLastItxn<ApplicationInnerTxn>().apps(asUint64(a))
  },
  /**
   * Number of Applications
   */
  get numApplications(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numApps
  },
  /**
   * Number of global state integers in ApplicationCall
   */
  get globalNumUint(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().globalNumUint
  },
  /**
   * Number of global state byteslices in ApplicationCall
   */
  get globalNumByteSlice(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().globalNumBytes
  },
  /**
   * Number of local state integers in ApplicationCall
   */
  get localNumUint(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().localNumUint
  },
  /**
   * Number of local state byteslices in ApplicationCall
   */
  get localNumByteSlice(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().localNumBytes
  },
  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  get extraProgramPages(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().extraProgramPages
  },
  /**
   * Marks an account nonparticipating for rewards
   */
  get nonparticipation(): boolean {
    return getLastItxn<KeyRegistrationInnerTxn>().nonparticipation
  },
  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(a: internal.primitives.StubUint64Compat): bytes {
    return getLastItxn<ApplicationInnerTxn>().logs(asUint64(a))
  },
  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  get numLogs(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numLogs
  },
  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  get createdAssetId(): Asset {
    return getLastItxn<AssetConfigInnerTxn>().createdAsset
  },
  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  get createdApplicationId(): Application {
    return getLastItxn<ApplicationInnerTxn>().createdApp
  },
  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  get lastLog(): bytes {
    return getLastItxn<ApplicationInnerTxn>().lastLog
  },
  /**
   * 64 byte state proof public key
   */
  get stateProofPk(): bytes {
    return getLastItxn<KeyRegistrationInnerTxn>().stateProofKey
  },
  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(a: internal.primitives.StubUint64Compat): bytes {
    return getLastItxn<ApplicationInnerTxn>().approvalProgramPages(asUint64(a))
  },
  /**
   * Number of Approval Program pages
   */
  get numApprovalProgramPages(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numApprovalProgramPages
  },
  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(a: internal.primitives.StubUint64Compat): bytes {
    return getLastItxn<ApplicationInnerTxn>().clearStateProgramPages(asUint64(a))
  },
  /**
   * Number of ClearState Program pages
   */
  get numClearStateProgramPages(): uint64 {
    return getLastItxn<ApplicationInnerTxn>().numClearStateProgramPages
  },
}

const setConstructingItxnField = (fields: Partial<InnerTxnFields>): void => {
  Object.assign(lazyContext.activeGroup.constructingItxn, fields)
}

const getConstructingItxn = <T extends InnerTxnFields>(): T => {
  return lazyContext.activeGroup.constructingItxn as T
}

export const ITxnCreate: internal.opTypes.ITxnCreateType = {
  begin: function (): void {
    lazyContext.activeGroup.beginInnerTransactionGroup()
  },
  setSender: function (a: Account): void {
    setConstructingItxnField({ sender: a })
  },
  setFee: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ fee: asUint64(a) })
  },
  setNote: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ note: asBytes(a) })
  },
  setReceiver: function (a: Account): void {
    setConstructingItxnField({ receiver: a })
  },
  setAmount: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ amount: asUint64(a) })
  },
  setCloseRemainderTo: function (a: Account): void {
    setConstructingItxnField({ closeRemainderTo: a })
  },
  setVotePk: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ voteKey: asBytes(a) })
  },
  setSelectionPk: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ selectionKey: asBytes(a) })
  },
  setVoteFirst: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ voteFirst: asUint64(a) })
  },
  setVoteLast: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ voteLast: asUint64(a) })
  },
  setVoteKeyDilution: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ voteKeyDilution: asUint64(a) })
  },
  setType: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ type: asBytesCls(a).toUint64().asNumber() as TransactionType })
  },
  setTypeEnum: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ type: asUint64Cls(a).asNumber() as TransactionType })
  },
  setXferAsset: function (a: Asset | internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ xferAsset: getAsset(a) })
  },
  setAssetAmount: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ assetAmount: asUint64(a) })
  },
  setAssetSender: function (a: Account): void {
    setConstructingItxnField({ assetSender: a })
  },
  setAssetReceiver: function (a: Account): void {
    setConstructingItxnField({ assetReceiver: a })
  },
  setAssetCloseTo: function (a: Account): void {
    setConstructingItxnField({ assetCloseTo: a })
  },
  setApplicationId: function (a: Application | internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ appId: getApp(a) })
  },
  setOnCompletion: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ onCompletion: asUint64(a) })
  },
  setApplicationArgs: function (a: internal.primitives.StubBytesCompat): void {
    const appArgs = (getConstructingItxn<itxn.ApplicationCallFields>().appArgs ?? []) as bytes[]
    appArgs.push(asBytes(a))
    setConstructingItxnField({ appArgs })
  },
  setAccounts: function (a: Account): void {
    const accounts = (getConstructingItxn<itxn.ApplicationCallFields>().accounts ?? []) as Account[]
    accounts.push(a)
    setConstructingItxnField({ accounts })
  },
  setApprovalProgram: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ approvalProgram: asBytes(a) })
  },
  setClearStateProgram: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ clearStateProgram: asBytes(a) })
  },
  setRekeyTo: function (a: Account): void {
    setConstructingItxnField({ rekeyTo: a })
  },
  setConfigAsset: function (a: Asset | internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ configAsset: getAsset(a) })
  },
  setConfigAssetTotal: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ total: asUint64(a) })
  },
  setConfigAssetDecimals: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ decimals: asUint64(a) })
  },
  setConfigAssetDefaultFrozen: function (a: boolean): void {
    setConstructingItxnField({ defaultFrozen: a })
  },
  setConfigAssetUnitName: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ unitName: asBytes(a) })
  },
  setConfigAssetName: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ assetName: asBytes(a) })
  },
  setConfigAssetUrl: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ url: asBytes(a) })
  },
  setConfigAssetMetadataHash: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ metadataHash: asBytes(a) })
  },
  setConfigAssetManager: function (a: Account): void {
    setConstructingItxnField({ manager: a })
  },
  setConfigAssetReserve: function (a: Account): void {
    setConstructingItxnField({ reserve: a })
  },
  setConfigAssetFreeze: function (a: Account): void {
    setConstructingItxnField({ freeze: a })
  },
  setConfigAssetClawback: function (a: Account): void {
    setConstructingItxnField({ clawback: a })
  },
  setFreezeAsset: function (a: Asset | internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ freezeAsset: getAsset(a) })
  },
  setFreezeAssetAccount: function (a: Account): void {
    setConstructingItxnField({ freezeAccount: a })
  },
  setFreezeAssetFrozen: function (a: boolean): void {
    setConstructingItxnField({ frozen: a })
  },
  setAssets: function (a: internal.primitives.StubUint64Compat): void {
    const asset = getAsset(a)
    if (asset) {
      const assets = (getConstructingItxn<itxn.ApplicationCallFields>().assets ?? []) as Asset[]
      assets.push(asset)
      setConstructingItxnField({ assets })
    }
  },
  setApplications: function (a: internal.primitives.StubUint64Compat): void {
    const app = getApp(a)
    if (app) {
      const apps = (getConstructingItxn<itxn.ApplicationCallFields>().apps ?? []) as Application[]
      apps.push(app)
      setConstructingItxnField({ apps })
    }
  },
  setGlobalNumUint: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ globalNumUint: asUint64(a) })
  },
  setGlobalNumByteSlice: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ globalNumBytes: asUint64(a) })
  },
  setLocalNumUint: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ localNumUint: asUint64(a) })
  },
  setLocalNumByteSlice: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ localNumBytes: asUint64(a) })
  },
  setExtraProgramPages: function (a: internal.primitives.StubUint64Compat): void {
    setConstructingItxnField({ extraProgramPages: asUint64(a) })
  },
  setNonparticipation: function (a: boolean): void {
    setConstructingItxnField({ nonparticipation: a })
  },
  setStateProofPk: function (a: internal.primitives.StubBytesCompat): void {
    setConstructingItxnField({ stateProofKey: asBytes(a) })
  },
  setApprovalProgramPages: function (a: internal.primitives.StubBytesCompat): void {
    let pages = (getConstructingItxn<itxn.ApplicationCallFields>().approvalProgram ?? []) as bytes[]
    if (!Array.isArray(pages)) {
      pages = [pages]
    }
    pages.push(asBytes(a))
    setConstructingItxnField({ approvalProgram: pages })
  },
  setClearStateProgramPages: function (a: internal.primitives.StubBytesCompat): void {
    let pages = (getConstructingItxn<itxn.ApplicationCallFields>().clearStateProgram ?? []) as bytes[]
    if (!Array.isArray(pages)) {
      pages = [pages]
    }
    pages.push(asBytes(a))
    setConstructingItxnField({ clearStateProgram: pages })
  },
  next: function (): void {
    lazyContext.activeGroup.appendInnterTransactionGroup()
  },
  submit: function (): void {
    lazyContext.activeGroup.submitInnerTransactionGroup()
  },
}
