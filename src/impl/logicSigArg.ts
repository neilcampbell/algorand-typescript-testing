import type { bytes, internal } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { asNumber } from '../util'

export const arg = (a: internal.primitives.StubUint64Compat): bytes => {
  const index = asNumber(a)
  return lazyContext.value.activeLogicSigArgs[index]
}
