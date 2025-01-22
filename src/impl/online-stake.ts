import type { internal } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'

export const onlineStake: internal.opTypes.OnlineStakeType = () => {
  return lazyContext.ledger.onlineStake
}
