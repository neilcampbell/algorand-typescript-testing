import {
  type Account as AccountType,
  type Asset as AssetType,
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

const resolveAssetIndex = (assetIdOrIndex: internal.primitives.StubUint64Compat): uint64 => {
  const input = asUint64(assetIdOrIndex)
  if (input >= 1001) {
    return input
  }
  const txn = lazyContext.activeGroup.activeTransaction as gtxn.ApplicationTxn
  return txn.assets(input).id
}

export const getAsset = (asset: AssetType | internal.primitives.StubUint64Compat): AssetType | undefined => {
  try {
    const assetId = asMaybeUint64Cls(asset)
    if (assetId !== undefined) {
      return lazyContext.ledger.getAsset(resolveAssetIndex(assetId))
    }
    return asset as AssetType
  } catch {
    return undefined
  }
}

export const AssetParams: internal.opTypes.AssetParamsType = {
  assetTotal(a: AssetType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Uint64(0), false] : [asset.total, true]
  },
  assetDecimals(a: AssetType | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Uint64(0), false] : [asset.decimals, true]
  },
  assetDefaultFrozen(a: AssetType | internal.primitives.StubUint64Compat): readonly [boolean, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [false, false] : [asset.defaultFrozen, true]
  },
  assetUnitName(a: AssetType | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.unitName, true]
  },
  assetName(a: AssetType | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.name, true]
  },
  assetUrl(a: AssetType | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.url, true]
  },
  assetMetadataHash(a: AssetType | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.metadataHash, true]
  },
  assetManager(a: AssetType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.manager, true]
  },
  assetReserve(a: AssetType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.reserve, true]
  },
  assetFreeze(a: AssetType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.freeze, true]
  },
  assetClawback(a: AssetType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.clawback, true]
  },
  assetCreator(a: AssetType | internal.primitives.StubUint64Compat): readonly [AccountType, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.creator, true]
  },
}
