import { internal, uint64 } from '@algorandfoundation/algorand-typescript'
import { AbiMetadata } from '../abi-metadata'
import { ApplicationTransaction } from '../impl/transactions'
import { lazyContext } from './internal-context'

export const checkRoutingConditions = (appId: uint64, metadata: AbiMetadata) => {
  const appData = lazyContext.getApplicationData(appId)
  const isCreating = appData.isCreating
  if (isCreating && metadata.onCreate === 'disallow') {
    throw new internal.errors.CodeError('method can not be called while creating')
  }
  if (!isCreating && metadata.onCreate === 'require') {
    throw new internal.errors.CodeError('method can only be called while creating')
  }
  const txn = lazyContext.activeGroup.activeTransaction
  if (txn instanceof ApplicationTransaction && metadata.allowActions && !metadata.allowActions.includes(txn.onCompletion)) {
    throw new internal.errors.CodeError(
      `method can only be called with one of the following on_completion values: ${metadata.allowActions.join(', ')}`,
    )
  }
}
