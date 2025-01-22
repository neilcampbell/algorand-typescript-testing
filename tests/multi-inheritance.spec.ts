import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach } from 'node:test'
import { describe, expect, it } from 'vitest'
import { MultiBases } from './artifacts/multi-inheritance/contract.algo'
import appSpecJson from './artifacts/multi-inheritance/data/MultiBases.arc32.json'
import { getAlgorandAppClient, getAvmResult } from './avm-invoker'

describe('multi-inheritance', async () => {
  const ctx = new TestExecutionContext()
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)

  afterEach(() => ctx.reset())

  it('should be able to call methods from super classes', async () => {
    const contract = ctx.contract.create(MultiBases)

    const avmMethod1Result = await getAvmResult({ appClient }, 'methodOne')
    const avmMethod2Result = await getAvmResult({ appClient }, 'methodTwo')
    const avmMethodMultiResult = await getAvmResult({ appClient }, 'methodMulti')
    const avmMethodCallsSuperResult = await getAvmResult({ appClient }, 'methodCallsSuper')
    const avmCallB2CantOverrideResult = await getAvmResult({ appClient }, 'callB2CantOverride')
    const avmCallB2CommonResult = await getAvmResult({ appClient }, 'callB2Common')

    const method1Result = contract.methodOne()
    const method2Result = contract.methodTwo()
    const methodMultiResult = contract.methodMulti()
    const methodCallsSuperResult = contract.methodCallsSuper()
    const callB2CantOverrideResult = contract.callB2CantOverride()
    const callB2CommonResult = contract.callB2Common()

    expect(method1Result).toEqual('base-one')
    expect(method2Result).toEqual('base-two')
    expect(methodMultiResult).toEqual('multi-bases')
    expect(methodCallsSuperResult).toEqual('base-two')
    expect(callB2CantOverrideResult).toEqual('base-two')
    expect(callB2CommonResult).toEqual('common')

    expect(method1Result).toEqual(avmMethod1Result)
    expect(method2Result).toEqual(avmMethod2Result)
    expect(methodMultiResult).toEqual(avmMethodMultiResult)
    expect(methodCallsSuperResult).toEqual(avmMethodCallsSuperResult)
    expect(callB2CantOverrideResult).toEqual(avmCallB2CantOverrideResult)
    expect(callB2CommonResult).toEqual(avmCallB2CommonResult)
  })
})
