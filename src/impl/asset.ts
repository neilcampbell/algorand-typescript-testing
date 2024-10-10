import { Account, Asset, bytes, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { Mutable } from '../typescript-helpers'
import { asBigInt, asUint64 } from '../util'
import { AssetHolding } from './account'
import { Uint64BackedCls } from './base'

export type AssetData = Mutable<Omit<Asset, 'id' | 'balance' | 'frozen'>>

export class AssetCls extends Uint64BackedCls implements Asset {
  get id(): uint64 {
    return this.uint64
  }

  constructor(id?: internal.primitives.StubUint64Compat) {
    super(asUint64(id ?? 0))
  }

  private get data(): AssetData {
    return lazyContext.getAssetData(this.id)
  }

  get total(): uint64 {
    return this.data.total
  }
  get decimals(): uint64 {
    return this.data.decimals
  }
  get defaultFrozen(): boolean {
    return this.data.defaultFrozen
  }
  get unitName(): bytes {
    return this.data.unitName
  }
  get name(): bytes {
    return this.data.name
  }
  get url(): bytes {
    return this.data.url
  }
  get metadataHash(): bytes {
    return this.data.metadataHash
  }
  get manager(): Account {
    return this.data.manager
  }
  get reserve(): Account {
    return this.data.reserve
  }
  get freeze(): Account {
    return this.data.freeze
  }
  get clawback(): Account {
    return this.data.clawback
  }
  get creator(): Account {
    return this.data.creator
  }
  balance(account: Account): uint64 {
    return this.getAssetHolding(account).balance
  }
  frozen(account: Account): boolean {
    return this.getAssetHolding(account).frozen
  }

  private getAssetHolding(account: Account): AssetHolding {
    const accountData = lazyContext.getAccountData(account)
    if (!accountData.optedAssets.has(asBigInt(this.id))) {
      internal.errors.internalError(
        'The asset is not opted into the account! Use `ctx.any.account(opted_asset_balances={{ASSET_ID: VALUE}})` to set emulated opted asset into the account.',
      )
    }
    return accountData.optedAssets.get(asBigInt(this.id))!
  }
}
