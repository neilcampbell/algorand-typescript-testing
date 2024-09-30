import { Account, Application, arc4, Asset, bytes, internal, TransactionType, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asNumber, asUint64, asUint64Cls } from '../util'
import {
  ApplicationTransaction,
  AssetConfigTransaction,
  AssetFreezeTransaction,
  AssetTransferTransaction,
  KeyRegistrationTransaction,
  PaymentTransaction,
  Transaction,
} from './transactions'

export const getApplicationTransaction = (index?: internal.primitives.StubUint64Compat): ApplicationTransaction => {
  return getTransactionImpl({ type: TransactionType.ApplicationCall, index }) as ApplicationTransaction
}
export const getAssetConfigTransaction = (index?: internal.primitives.StubUint64Compat): AssetConfigTransaction => {
  return getTransactionImpl({ type: TransactionType.AssetConfig, index }) as AssetConfigTransaction
}
export const getAssetTransferTransaction = (index?: internal.primitives.StubUint64Compat): AssetTransferTransaction => {
  return getTransactionImpl({ type: TransactionType.AssetTransfer, index }) as AssetTransferTransaction
}
export const getAssetFreezeTransaction = (index?: internal.primitives.StubUint64Compat): AssetFreezeTransaction => {
  return getTransactionImpl({ type: TransactionType.AssetFreeze, index }) as AssetFreezeTransaction
}
export const getKeyRegistrationTransaction = (index?: internal.primitives.StubUint64Compat): KeyRegistrationTransaction => {
  return getTransactionImpl({ type: TransactionType.KeyRegistration, index }) as KeyRegistrationTransaction
}
export const getPaymentTransaction = (index?: internal.primitives.StubUint64Compat): PaymentTransaction => {
  return getTransactionImpl({ type: TransactionType.Payment, index }) as PaymentTransaction
}
export const getTransaction = (index?: internal.primitives.StubUint64Compat): Transaction => {
  return getTransactionImpl({ index })
}
const getTransactionImpl = ({ type, index }: { type?: TransactionType; index?: internal.primitives.StubUint64Compat }) => {
  const i = index !== undefined ? asNumber(index) : undefined
  if (i !== undefined && i >= lazyContext.activeGroup.transactions.length) {
    throw new internal.errors.InternalError('Invalid group index')
  }
  const transaction = i !== undefined ? lazyContext.activeGroup.transactions[i] : lazyContext.activeGroup.activeTransaction
  if (type === undefined) {
    return transaction
  }
  if (transaction.type !== type) {
    throw new internal.errors.InternalError(`Invalid transaction type: ${transaction.type}`)
  }
  switch (type) {
    case TransactionType.ApplicationCall:
      return transaction as ApplicationTransaction
    case TransactionType.Payment:
      return transaction as PaymentTransaction
    case TransactionType.AssetConfig:
      return transaction as AssetConfigTransaction
    case TransactionType.AssetTransfer:
      return transaction as AssetTransferTransaction
    case TransactionType.AssetFreeze:
      return transaction as AssetFreezeTransaction
    case TransactionType.KeyRegistration:
      return transaction as KeyRegistrationTransaction
    default:
      throw new internal.errors.InternalError(`Invalid transaction type: ${type}`)
  }
}

export const GTxn: internal.opTypes.GTxnType = {
  sender(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction(t).sender
  },
  fee(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).fee
  },
  firstValid(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).firstValid
  },
  firstValidTime(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).firstValidTime
  },
  lastValid(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).lastValid
  },
  note(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction(t).note
  },
  lease(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction(t).lease
  },
  receiver(t: internal.primitives.StubUint64Compat): Account {
    return getPaymentTransaction(t).receiver
  },
  amount(t: uint64): uint64 {
    return getPaymentTransaction(t).amount
  },
  closeRemainderTo(t: internal.primitives.StubUint64Compat): Account {
    return getPaymentTransaction(t).closeRemainderTo
  },
  votePk(t: internal.primitives.StubUint64Compat): bytes {
    return getKeyRegistrationTransaction(t).voteKey
  },
  selectionPk(t: internal.primitives.StubUint64Compat): bytes {
    return getKeyRegistrationTransaction(t).selectionKey
  },
  voteFirst(t: internal.primitives.StubUint64Compat): uint64 {
    return getKeyRegistrationTransaction(t).voteFirst
  },
  voteLast(t: internal.primitives.StubUint64Compat): uint64 {
    return getKeyRegistrationTransaction(t).voteLast
  },
  voteKeyDilution(t: internal.primitives.StubUint64Compat): uint64 {
    return getKeyRegistrationTransaction(t).voteKeyDilution
  },
  type(t: internal.primitives.StubUint64Compat): bytes {
    return asUint64Cls(getTransaction(t).type).toBytes().asAlgoTs()
  },
  typeEnum(t: uint64): uint64 {
    return asUint64(getTransaction(t).type)
  },
  xferAsset(t: internal.primitives.StubUint64Compat): Asset {
    return getAssetTransferTransaction(t).xferAsset
  },
  assetAmount(t: internal.primitives.StubUint64Compat): uint64 {
    return getAssetTransferTransaction(t).assetAmount
  },
  assetSender(t: internal.primitives.StubUint64Compat): Account {
    return getAssetTransferTransaction(t).assetSender
  },
  assetReceiver(t: internal.primitives.StubUint64Compat): Account {
    return getAssetTransferTransaction(t).assetReceiver
  },
  assetCloseTo(t: internal.primitives.StubUint64Compat): Account {
    return getAssetTransferTransaction(t).assetCloseTo
  },
  groupIndex(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).groupIndex
  },
  txId(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction(t).txnId
  },
  applicationId(t: internal.primitives.StubUint64Compat): Application {
    return getApplicationTransaction(t).appId
  },
  onCompletion(t: internal.primitives.StubUint64Compat): uint64 {
    const onCompletionStr = getApplicationTransaction(t).onCompletion
    return asUint64(arc4.OnCompleteAction[onCompletionStr])
  },
  applicationArgs(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(a).appArgs(asUint64(b))
  },
  numAppArgs(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numAppArgs
  },
  accounts(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Account {
    return getApplicationTransaction(a).accounts(asUint64(b))
  },
  numAccounts(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numAccounts
  },
  approvalProgram(t: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(t).approvalProgram
  },
  clearStateProgram(t: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(t).clearStateProgram
  },
  rekeyTo(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction(t).rekeyTo
  },
  configAsset(t: internal.primitives.StubUint64Compat): Asset {
    return getAssetConfigTransaction(t).configAsset
  },
  configAssetTotal(t: internal.primitives.StubUint64Compat): uint64 {
    return getAssetConfigTransaction(t).total
  },
  configAssetDecimals(t: internal.primitives.StubUint64Compat): uint64 {
    return getAssetConfigTransaction(t).decimals
  },
  configAssetDefaultFrozen(t: internal.primitives.StubUint64Compat): boolean {
    return getAssetConfigTransaction(t).defaultFrozen
  },
  configAssetUnitName(t: internal.primitives.StubUint64Compat): bytes {
    return getAssetConfigTransaction(t).unitName
  },
  configAssetName(t: internal.primitives.StubUint64Compat): bytes {
    return getAssetConfigTransaction(t).assetName
  },
  configAssetUrl(t: internal.primitives.StubUint64Compat): bytes {
    return getAssetConfigTransaction(t).url
  },
  configAssetMetadataHash(t: internal.primitives.StubUint64Compat): bytes {
    return getAssetConfigTransaction(t).metadataHash
  },
  configAssetManager(t: internal.primitives.StubUint64Compat): Account {
    return getAssetConfigTransaction(t).manager
  },
  configAssetReserve(t: internal.primitives.StubUint64Compat): Account {
    return getAssetConfigTransaction(t).reserve
  },
  configAssetFreeze(t: internal.primitives.StubUint64Compat): Account {
    return getAssetConfigTransaction(t).freeze
  },
  configAssetClawback(t: internal.primitives.StubUint64Compat): Account {
    return getAssetConfigTransaction(t).clawback
  },
  freezeAsset(t: internal.primitives.StubUint64Compat): Asset {
    return getAssetFreezeTransaction(t).freezeAsset
  },
  freezeAssetAccount(t: internal.primitives.StubUint64Compat): Account {
    return getAssetFreezeTransaction(t).freezeAccount
  },
  freezeAssetFrozen(t: internal.primitives.StubUint64Compat): boolean {
    return getAssetFreezeTransaction(t).frozen
  },
  assets(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Asset {
    return getApplicationTransaction(a).assets(asUint64(b))
  },
  numAssets(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numAssets
  },
  applications(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Application {
    return getApplicationTransaction(a).apps(asUint64(b))
  },
  numApplications(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numApps
  },
  globalNumUint(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).globalNumUint
  },
  globalNumByteSlice(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).globalNumBytes
  },
  localNumUint(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).localNumUint
  },
  localNumByteSlice(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).localNumBytes
  },
  extraProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).extraProgramPages
  },
  nonparticipation(t: internal.primitives.StubUint64Compat): boolean {
    return getKeyRegistrationTransaction(t).nonparticipation
  },
  logs(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(a).logs(asUint64(b))
  },
  numLogs(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numLogs
  },
  createdAssetId(t: internal.primitives.StubUint64Compat): Asset {
    return getAssetConfigTransaction(t).createdAsset
  },
  createdApplicationId(t: internal.primitives.StubUint64Compat): Application {
    return getApplicationTransaction(t).createdApp
  },
  lastLog(t: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(t).lastLog
  },
  stateProofPk(t: internal.primitives.StubUint64Compat): bytes {
    return getKeyRegistrationTransaction(t).stateProofKey
  },
  approvalProgramPages(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(a).approvalProgramPages(asUint64(b))
  },
  numApprovalProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numApprovalProgramPages
  },
  clearStateProgramPages(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getApplicationTransaction(a).clearStateProgramPages(asUint64(b))
  },
  numClearStateProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return getApplicationTransaction(t).numClearStateProgramPages
  },
}
