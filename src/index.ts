import { internal } from '@algorandfoundation/algorand-typescript'

export { TestExecutionContext } from './test-execution-context'
export const encodingUtil = {
  ...internal.encodingUtil,
  toExternalValue: internal.primitives.toExternalValue,
}
