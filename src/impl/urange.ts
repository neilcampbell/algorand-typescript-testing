import { internal } from '@algorandfoundation/algorand-typescript'
import { asBigInt, asUint64 } from '../util'

export function* urangeImpl(
  a: internal.primitives.StubUint64Compat,
  b?: internal.primitives.StubUint64Compat,
  c?: internal.primitives.StubUint64Compat,
) {
  const start = b ? asBigInt(a) : BigInt(0)
  const end = b ? asBigInt(b) : asBigInt(a)
  const step = c ? asBigInt(c) : BigInt(1)
  let iterationCount = 0
  for (let i = start; i < end; i += step) {
    iterationCount++
    yield asUint64(i)
  }
  return iterationCount
}
