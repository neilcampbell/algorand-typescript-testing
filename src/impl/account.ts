import { Account, Application, Asset, bytes, internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint64Map } from '../collections/custom-key-map'
import { DEFAULT_ACCOUNT_MIN_BALANCE, ZERO_ADDRESS } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { Mutable } from '../typescript-helpers'
import { asUint64, asUint64Cls } from '../util'
import { ApplicationCls } from './application'
import { AssetCls } from './asset'
import { BytesBackedCls } from './base'

export class AssetHolding {
  balance: uint64
  frozen: boolean
  constructor(balance: internal.primitives.StubUint64Compat, frozen: boolean) {
    this.balance = asUint64(balance)
    this.frozen = frozen
  }
}

export class AccountData {
  optedAssets = new Uint64Map<AssetHolding>()
  optedApplications = new Uint64Map<Application>()
  account: Mutable<Omit<Account, 'bytes' | 'isOptedIn'>>

  constructor() {
    this.account = {
      totalAppsCreated: 0,
      totalAppsOptedIn: 0,
      totalAssets: 0,
      totalAssetsCreated: 0,
      totalBoxBytes: 0,
      totalBoxes: 0,
      totalExtraAppPages: 0,
      totalNumByteSlice: 0,
      totalNumUint: 0,
      minBalance: DEFAULT_ACCOUNT_MIN_BALANCE,
      balance: 0,
      authAddress: Account(),
    }
  }
}

export class AccountCls extends BytesBackedCls implements Account {
  constructor(address?: bytes) {
    const addressBytes = address ?? ZERO_ADDRESS
    if (![32n, 36n].includes(asUint64Cls(addressBytes.length).valueOf())) {
      throw new internal.errors.AvmError('Address must be 32 bytes long, or 36 bytes including checksum')
    }
    super(addressBytes.slice(0, 32))
  }

  private get data(): AccountData {
    return lazyContext.getAccountData(this)
  }

  get balance(): uint64 {
    return this.data.account.balance
  }
  get minBalance(): uint64 {
    return this.data.account.minBalance
  }
  get authAddress(): Account {
    return this.data.account.authAddress
  }
  get totalNumUint(): uint64 {
    return this.data.account.totalNumUint
  }
  get totalNumByteSlice(): uint64 {
    return this.data.account.totalNumByteSlice
  }
  get totalExtraAppPages(): uint64 {
    return this.data.account.totalExtraAppPages
  }
  get totalAppsCreated(): uint64 {
    return this.data.account.totalAppsCreated
  }
  get totalAppsOptedIn(): uint64 {
    return this.data.account.totalAppsOptedIn
  }
  get totalAssetsCreated(): uint64 {
    return this.data.account.totalAssetsCreated
  }
  get totalAssets(): uint64 {
    return this.data.account.totalAssets
  }
  get totalBoxes(): uint64 {
    return this.data.account.totalBoxes
  }
  get totalBoxBytes(): uint64 {
    return this.data.account.totalBoxBytes
  }

  isOptedIn(assetOrApp: Asset | Application): boolean {
    if (assetOrApp instanceof AssetCls) {
      return this.data.optedAssets.has(assetOrApp.id)
    }
    if (assetOrApp instanceof ApplicationCls) {
      return this.data.optedApplications.has(asUint64Cls(assetOrApp.id).asBigInt())
    }
    throw new internal.errors.InternalError('Invalid argument type. Must be an `algopy.Asset` or `algopy.Application` instance.')
  }
}
