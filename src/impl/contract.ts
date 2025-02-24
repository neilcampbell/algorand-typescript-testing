import type { arc4 } from '@algorandfoundation/algorand-typescript'
import type { DeliberateAny } from '../typescript-helpers'
import { BaseContract } from './base-contract'

export class Contract extends BaseContract {
  static isArc4 = true

  override approvalProgram(): boolean {
    return true
  }
}

export function abimethod<TContract extends Contract>(_config?: arc4.AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
  ): (this: TContract, ...args: TArgs) => TReturn {
    return target
  }
}

export function baremethod<TContract extends Contract>(_config?: arc4.BareMethodConfig) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: (this: TContract, ...args: TArgs) => TReturn,
  ): (this: TContract, ...args: TArgs) => TReturn {
    return target
  }
}
