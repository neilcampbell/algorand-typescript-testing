import { internal } from '@algorandfoundation/algorand-typescript'

export { addEqualityTesters } from './set-up'
export { TestExecutionContext } from './test-execution-context'
export const encodingUtil = {
  ...internal.encodingUtil,
  toExternalValue: internal.primitives.toExternalValue,
}
