import type { TestExecutionContext } from '../test-execution-context'

declare global {
  // eslint-disable-next-line no-var
  var puyaTsExecutionContext: TestExecutionContext | undefined
}

export const ctxMgr = {
  set instance(ctx: TestExecutionContext) {
    const instance = global.puyaTsExecutionContext
    if (instance != undefined) throw new Error('Execution context has already been set')
    global.puyaTsExecutionContext = ctx
  },
  get instance() {
    const instance = global.puyaTsExecutionContext
    if (instance == undefined) throw new Error('No execution context has been set')
    return instance
  },
  reset() {
    global.puyaTsExecutionContext = undefined
  },
}
