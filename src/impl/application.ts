import { Account, Application, Bytes, bytes, LocalState, uint64 } from '@algorandfoundation/algorand-typescript'
import algosdk from 'algosdk'
import { BytesMap } from '../collections/custom-key-map'
import { ALWAYS_APPROVE_TEAL_PROGRAM } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { Mutable } from '../typescript-helpers'
import { asBigInt, asUint64 } from '../util'
import { Uint64BackedCls } from './base'
import { GlobalStateCls } from './state'

export class ApplicationData {
  application: Mutable<Omit<Application, 'id' | 'address'>> & {
    appLogs: bytes[]
    globalStates: BytesMap<GlobalStateCls<unknown>>
    localStates: BytesMap<LocalState<unknown>>
  }
  isCreating: boolean = false

  get appLogs() {
    return this.application.appLogs
  }

  constructor() {
    this.application = {
      approvalProgram: ALWAYS_APPROVE_TEAL_PROGRAM,
      clearStateProgram: ALWAYS_APPROVE_TEAL_PROGRAM,
      globalNumUint: 0,
      globalNumBytes: 0,
      localNumUint: 0,
      localNumBytes: 0,
      extraProgramPages: 0,
      creator: lazyContext.defaultSender,
      appLogs: [],
      globalStates: new BytesMap(),
      localStates: new BytesMap(),
    }
  }
}

export class ApplicationCls extends Uint64BackedCls implements Application {
  get id() {
    return this.uint64
  }

  constructor(id?: uint64) {
    super(asUint64(id ?? 0))
  }

  private get data(): ApplicationData {
    return lazyContext.getApplicationData(this.id)
  }
  get approvalProgram(): bytes {
    return this.data.application.approvalProgram
  }
  get clearStateProgram(): bytes {
    return this.data.application.clearStateProgram
  }
  get globalNumUint(): uint64 {
    return this.data.application.globalNumUint
  }
  get globalNumBytes(): uint64 {
    return this.data.application.globalNumBytes
  }
  get localNumUint(): uint64 {
    return this.data.application.localNumUint
  }
  get localNumBytes(): uint64 {
    return this.data.application.localNumBytes
  }
  get extraProgramPages(): uint64 {
    return this.data.application.extraProgramPages
  }
  get creator(): Account {
    return this.data.application.creator
  }
  get address(): Account {
    const addr = algosdk.getApplicationAddress(asBigInt(this.id))
    return Account(Bytes.fromBase32(addr))
  }
}
