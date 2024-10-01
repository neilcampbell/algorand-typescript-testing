import { Account, Application, Asset, Bytes, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { captureMethodConfig } from './abi-metadata'
import { DecodedLogs, LogDecoding } from './decode-logs'
import * as ops from './impl'
import { AccountCls } from './impl/account'
import { ApplicationCls } from './impl/application'
import { AssetCls } from './impl/asset'
import { ContractContext } from './subcontexts/contract-context'
import { LedgerContext } from './subcontexts/ledger-context'
import { TransactionContext } from './subcontexts/transaction-context'
import { ValueGenerator } from './value-generators'
import {
  submitGroup as itxnSubmitGroup,
  payment as itxnPayment,
  keyRegistration as itxnKeyRegistration,
  assetConfig as itxnAssetConfig,
  assetTransfer as itxnAssetTransfer,
  assetFreeze as itxnAssetFreeze,
  applicationCall as itxnApplicationCall,
} from './impl/inner-transactions'

export class TestExecutionContext implements internal.ExecutionContext {
  #applicationLogs: Map<bigint, bytes[]>
  #contractContext: ContractContext
  #ledgerContext: LedgerContext
  #txnContext: TransactionContext
  #valueGenerator: ValueGenerator
  #defaultSender: Account

  constructor() {
    internal.ctxMgr.instance = this
    this.#applicationLogs = new Map()
    this.#contractContext = new ContractContext()
    this.#ledgerContext = new LedgerContext()
    this.#txnContext = new TransactionContext()
    this.#valueGenerator = new ValueGenerator()
    this.#defaultSender = Account(Bytes(algosdk.generateAccount().addr))
  }

  account(address?: bytes): Account {
    return new AccountCls(address)
  }

  application(id?: uint64): Application {
    return new ApplicationCls(id)
  }

  asset(id?: uint64): Asset {
    return new AssetCls(id)
  }

  log(value: bytes): void {
    this.txn.appendLog(value)
  }

  exportLogs<const T extends [...LogDecoding[]]>(appId: uint64, ...decoding: T): DecodedLogs<T> {
    return this.txn.exportLogs(appId, ...decoding)
  }

  get op() {
    return ops
  }
  get contract() {
    return this.#contractContext
  }

  get ledger() {
    return this.#ledgerContext
  }

  get txn() {
    return this.#txnContext
  }

  get any() {
    return this.#valueGenerator
  }

  get defaultSender(): Account {
    return this.#defaultSender
  }

  get abiMetadata() {
    return {
      captureMethodConfig,
    }
  }

  get gtxn() {
    return {
      Transaction: (index: uint64) => this.txn.activeGroup.getTransaction(index),
      PaymentTxn: (index: uint64) => this.txn.activeGroup.getPaymentTransaction(index),
      KeyRegistrationTxn: (index: uint64) => this.txn.activeGroup.getKeyRegistrationTransaction(index),
      AssetConfigTxn: (index: uint64) => this.txn.activeGroup.getAssetConfigTransaction(index),
      AssetTransferTxn: (index: uint64) => this.txn.activeGroup.getAssetTransferTransaction(index),
      AssetFreezeTxn: (index: uint64) => this.txn.activeGroup.getAssetFreezeTransaction(index),
      ApplicationTxn: (index: uint64) => this.txn.activeGroup.getApplicationTransaction(index),
    }
  }

  get itxn() {
    return {
      submitGroup: itxnSubmitGroup,
      payment: itxnPayment,
      keyRegistration: itxnKeyRegistration,
      assetConfig: itxnAssetConfig,
      assetTransfer: itxnAssetTransfer,
      assetFreeze: itxnAssetFreeze,
      applicationCall: itxnApplicationCall,
    }
  }

  reset() {
    this.#applicationLogs.clear()
    this.#contractContext = new ContractContext()
    this.#ledgerContext = new LedgerContext()
    this.#txnContext = new TransactionContext()
    internal.ctxMgr.reset()
    internal.ctxMgr.instance = this
  }
}
