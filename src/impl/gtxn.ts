import type { Account, Application, Asset, bytes, internal, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4 } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asUint64, asUint64Cls } from '../util'

export const GTxn: typeof op.GTxn = {
  sender(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getTransaction(t).sender
  },
  fee(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getTransaction(t).fee
  },
  firstValid(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getTransaction(t).firstValid
  },
  firstValidTime(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getTransaction(t).firstValidTime
  },
  lastValid(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getTransaction(t).lastValid
  },
  note(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getTransaction(t).note
  },
  lease(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getTransaction(t).lease
  },
  receiver(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getPaymentTransaction(t).receiver
  },
  amount(t: uint64): uint64 {
    return lazyContext.activeGroup.getPaymentTransaction(t).amount
  },
  closeRemainderTo(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getPaymentTransaction(t).closeRemainderTo
  },
  votePk(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).voteKey
  },
  selectionPk(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).selectionKey
  },
  voteFirst(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).voteFirst
  },
  voteLast(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).voteLast
  },
  voteKeyDilution(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).voteKeyDilution
  },
  type(t: internal.primitives.StubUint64Compat): bytes {
    return asUint64Cls(lazyContext.activeGroup.getTransaction(t).type).toBytes().asAlgoTs()
  },
  typeEnum(t: uint64): uint64 {
    return asUint64(lazyContext.activeGroup.getTransaction(t).type)
  },
  xferAsset(t: internal.primitives.StubUint64Compat): Asset {
    return lazyContext.activeGroup.getAssetTransferTransaction(t).xferAsset
  },
  assetAmount(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getAssetTransferTransaction(t).assetAmount
  },
  assetSender(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetTransferTransaction(t).assetSender
  },
  assetReceiver(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetTransferTransaction(t).assetReceiver
  },
  assetCloseTo(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetTransferTransaction(t).assetCloseTo
  },
  groupIndex(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getTransaction(t).groupIndex
  },
  txId(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getTransaction(t).txnId
  },
  applicationId(t: internal.primitives.StubUint64Compat): Application {
    return lazyContext.activeGroup.getApplicationTransaction(t).appId
  },
  onCompletion(t: internal.primitives.StubUint64Compat): uint64 {
    const onCompletionStr = lazyContext.activeGroup.getApplicationTransaction(t).onCompletion
    return asUint64(arc4.OnCompleteAction[onCompletionStr])
  },
  applicationArgs(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(a).appArgs(asUint64(b))
  },
  numAppArgs(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numAppArgs
  },
  accounts(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getApplicationTransaction(a).accounts(asUint64(b))
  },
  numAccounts(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numAccounts
  },
  approvalProgram(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(t).approvalProgram
  },
  clearStateProgram(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(t).clearStateProgram
  },
  rekeyTo(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getTransaction(t).rekeyTo
  },
  configAsset(t: internal.primitives.StubUint64Compat): Asset {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).configAsset
  },
  configAssetTotal(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).total
  },
  configAssetDecimals(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).decimals
  },
  configAssetDefaultFrozen(t: internal.primitives.StubUint64Compat): boolean {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).defaultFrozen
  },
  configAssetUnitName(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).unitName
  },
  configAssetName(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).assetName
  },
  configAssetUrl(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).url
  },
  configAssetMetadataHash(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).metadataHash
  },
  configAssetManager(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).manager
  },
  configAssetReserve(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).reserve
  },
  configAssetFreeze(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).freeze
  },
  configAssetClawback(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).clawback
  },
  freezeAsset(t: internal.primitives.StubUint64Compat): Asset {
    return lazyContext.activeGroup.getAssetFreezeTransaction(t).freezeAsset
  },
  freezeAssetAccount(t: internal.primitives.StubUint64Compat): Account {
    return lazyContext.activeGroup.getAssetFreezeTransaction(t).freezeAccount
  },
  freezeAssetFrozen(t: internal.primitives.StubUint64Compat): boolean {
    return lazyContext.activeGroup.getAssetFreezeTransaction(t).frozen
  },
  assets(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Asset {
    return lazyContext.activeGroup.getApplicationTransaction(a).assets(asUint64(b))
  },
  numAssets(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numAssets
  },
  applications(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Application {
    return lazyContext.activeGroup.getApplicationTransaction(a).apps(asUint64(b))
  },
  numApplications(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numApps
  },
  globalNumUint(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).globalNumUint
  },
  globalNumByteSlice(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).globalNumBytes
  },
  localNumUint(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).localNumUint
  },
  localNumByteSlice(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).localNumBytes
  },
  extraProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).extraProgramPages
  },
  nonparticipation(t: internal.primitives.StubUint64Compat): boolean {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).nonparticipation
  },
  logs(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(a).logs(asUint64(b))
  },
  numLogs(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numLogs
  },
  createdAssetId(t: internal.primitives.StubUint64Compat): Asset {
    return lazyContext.activeGroup.getAssetConfigTransaction(t).createdAsset
  },
  createdApplicationId(t: internal.primitives.StubUint64Compat): Application {
    return lazyContext.activeGroup.getApplicationTransaction(t).createdApp
  },
  lastLog(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(t).lastLog
  },
  stateProofPk(t: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getKeyRegistrationTransaction(t).stateProofKey
  },
  approvalProgramPages(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(a).approvalProgramPages(asUint64(b))
  },
  numApprovalProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numApprovalProgramPages
  },
  clearStateProgramPages(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return lazyContext.activeGroup.getApplicationTransaction(a).clearStateProgramPages(asUint64(b))
  },
  numClearStateProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return lazyContext.activeGroup.getApplicationTransaction(t).numClearStateProgramPages
  },
}
