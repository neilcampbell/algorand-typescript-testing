import type { arc4 } from '@algorandfoundation/algorand-typescript'
import type { OnCompleteActionStr } from '@algorandfoundation/algorand-typescript/arc4'
import type { DeliberateAny } from '../typescript-helpers'
import { BaseContract } from './base-contract'

export class Contract extends BaseContract {
  static isArc4 = true

  override approvalProgram(): boolean {
    return true
  }
}

export const Arc4MethodConfigSymbol = Symbol('Arc4MethodConfig')
export function abimethod<TContract extends Contract>(config?: arc4.AbiMethodConfig<TContract>) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: { [Arc4MethodConfigSymbol]: arc4.AbiMethodConfig<TContract> } & ((this: TContract, ...args: TArgs) => TReturn),
  ): (this: TContract, ...args: TArgs) => TReturn {
    target[Arc4MethodConfigSymbol] = {
      ...config,
      onCreate: config?.onCreate ?? 'disallow',
      allowActions: ([] as OnCompleteActionStr[]).concat(config?.allowActions ?? 'NoOp'),
    }
    return target
  }
}

export function baremethod<TContract extends Contract>(config?: arc4.BareMethodConfig) {
  return function <TArgs extends DeliberateAny[], TReturn>(
    target: { [Arc4MethodConfigSymbol]: arc4.AbiMethodConfig<TContract> } & ((this: TContract, ...args: TArgs) => TReturn),
  ): (this: TContract, ...args: TArgs) => TReturn {
    target[Arc4MethodConfigSymbol] = {
      ...config,
      onCreate: config?.onCreate ?? 'disallow',
      allowActions: ([] as OnCompleteActionStr[]).concat(config?.allowActions ?? 'NoOp'),
    }
    return target
  }
}
