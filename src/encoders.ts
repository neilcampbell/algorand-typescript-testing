import { biguint, BigUint, bytes, Bytes, internal, TransactionType, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'
import { OnCompleteAction } from '@algorandfoundation/algorand-typescript/arc4'
import { AccountCls } from './impl/account'
import { ApplicationCls } from './impl/application'
import { AssetCls } from './impl/asset'

export interface TypeInfo {
  name: string
  genericArgs?: TypeInfo[] | Record<string, TypeInfo>
}

type fromBytes<T> = (val: Uint8Array, typeInfo: TypeInfo) => T

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
  application: ApplicationCls.fromBytes,
  asset: AssetCls.fromBytes,
  'bool(ean)?': booleanFromBytes,
  biguint: bigUintFromBytes,
  bytes: bytesFromBytes,
  string: stringFromBytes,
  uint64: uint64FromBytes,
  OnCompleteAction: onCompletionFromBytes,
  TransactionType: transactionTypeFromBytes,
  // 'Tuple<*>': tupleFromBytes,
}

export const getEncoder = <T>(typeInfo: TypeInfo): fromBytes<T> => {
  const encoder = Object.entries(encoders).find(([k, _]) => new RegExp(`^${k}$`, 'i').test(typeInfo.name))?.[1]
  if (!encoder) {
    throw new Error(`No encoder found for type ${typeInfo.name}`)
  }
  return encoder as fromBytes<T>
}
