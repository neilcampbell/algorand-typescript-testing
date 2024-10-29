import { biguint, BigUint, bytes, Bytes, internal, TransactionType, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'
import { OnCompleteAction } from '@algorandfoundation/algorand-typescript/arc4'
import { AccountCls } from './impl/account'
import { ApplicationCls } from './impl/application'
import { AssetCls } from './impl/asset'

export interface GenericTypeInfo {
  name: string
  wtypeName?: string
  genericArgs?: GenericTypeInfo[]
}

type fromBytes<T> = (val: Uint8Array, typeInfo: GenericTypeInfo) => T

const booleanFromBytes: fromBytes<boolean> = (val) => {
  return internal.encodingUtil.uint8ArrayToBigInt(val) > 0n
}

const bigUintFromBytes: fromBytes<biguint> = (val) => {
  return BigUint(internal.encodingUtil.uint8ArrayToBigInt(val))
}

const bytesFromBytes: fromBytes<bytes> = (val) => {
  return Bytes(val)
}

const stringFromBytes: fromBytes<string> = (val) => {
  return Bytes(val).toString()
}

const uint64FromBytes: fromBytes<uint64> = (val) => {
  return Uint64(internal.encodingUtil.uint8ArrayToBigInt(val))
}

const onCompletionFromBytes: fromBytes<OnCompleteAction> = (val) => {
  return Uint64(internal.encodingUtil.uint8ArrayToBigInt(val)) as OnCompleteAction
}

const transactionTypeFromBytes: fromBytes<TransactionType> = (val) => {
  return Uint64(internal.encodingUtil.uint8ArrayToBigInt(val)) as TransactionType
}

export const encoders = {
  account: AccountCls.fromBytes,
  Account: AccountCls.fromBytes,
  application: ApplicationCls.fromBytes,
  Application: ApplicationCls.fromBytes,
  asset: AssetCls.fromBytes,
  Asset: AssetCls.fromBytes,
  bool: booleanFromBytes,
  boolean: booleanFromBytes,
  biguint: bigUintFromBytes,
  bytes: bytesFromBytes,
  string: stringFromBytes,
  uint64: uint64FromBytes,
  OnCompleteAction: onCompletionFromBytes,
  TransactionType: transactionTypeFromBytes,
}

export const getEncoder = <T>(typeInfo: GenericTypeInfo): fromBytes<T> => {
  const encoder = encoders[typeInfo.name as keyof typeof encoders]
  if (!encoder) {
    throw new Error(`No encoder found for type ${typeInfo.name}`)
  }
  return encoder as fromBytes<T>
}
