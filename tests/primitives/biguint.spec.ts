// noinspection SuspiciousTypeOfGuard

import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { biguint } from '@algorandfoundation/algorand-typescript'
import { BigUint, Bytes, internal, Uint64 } from '@algorandfoundation/algorand-typescript'
import { describe, expect, it } from 'vitest'
import { BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE, MAX_UINT512, MAX_UINT64 } from '../../src/constants'
import appSpecJson from '../artifacts/primitive-ops/data/PrimitiveOpsContract.arc32.json'
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from '../avm-invoker'
import { abiAsBytes } from '../util'

const asBigUint = (val: bigint | number) => (typeof val === 'bigint' ? BigUint(val) : BigUint(val))

describe('BigUint', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)

  describe.each(['eq', 'ne', 'lt', 'le', 'gt', 'ge'])('logical operators', async (op) => {
    const operator = (function () {
      switch (op) {
        case 'eq':
          return '==='
        case 'ne':
          return '!=='
        case 'lt':
          return '<'
        case 'le':
          return '<='
        case 'gt':
          return '>'
        case 'ge':
          return '>='
        default:
          throw new Error(`Unknown operator: ${op}`)
      }
    })()
    const getStubResult = (a: number | bigint | biguint, b: number | bigint | biguint) => {
      switch (operator) {
        case '===':
          return a === b
        case '!==':
          return a !== b
        case '<':
          return a < b
        case '<=':
          return a <= b
        case '>':
          return a > b
        case '>=':
          return a >= b
        default:
          throw new Error(`Unknown operator: ${op}`)
      }
    }
    describe.each([
      [0, 0],
      [0, 1],
      [0, MAX_UINT512],
      [1, 0],
      [1, 1],
      [256, 512],
      [1, MAX_UINT512],
      [MAX_UINT512, MAX_UINT512],
    ])(`${operator}`, async (a, b) => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      it(`${a} ${operator} ${b}`, async () => {
        const avmResult = await getAvmResult<boolean>({ appClient }, `verify_biguint_${op}`, bytesA, bytesB)
        let result = getStubResult(bigUintA, bigUintB)
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

        result = getStubResult(a, bigUintB)
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

        result = getStubResult(bigUintA, b)
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      })
    })

    describe.each([
      [0, 0],
      [0, 1],
      [0, MAX_UINT512],
      [1, 0],
      [1, 1],
      [256, 512],
      [1, MAX_UINT512],
      [MAX_UINT512, MAX_UINT512],
    ])(`${operator} using bytes`, async (a, b) => {
      const bytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      const bytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b))
      const paddedBytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a), 64)
      const paddedBytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b), 64)
      const bigUintA = BigUint(Bytes(bytesA))
      const bigUintB = BigUint(Bytes(bytesB))
      const paddedBigUintA = BigUint(Bytes(paddedBytesA))
      const paddedBigUintB = BigUint(Bytes(paddedBytesB))

      it(`${a} ${operator} ${b}`, async () => {
        let avmResult = await getAvmResult<boolean>({ appClient }, `verify_biguint_${op}`, bytesA, paddedBytesB)
        let result = getStubResult(bigUintA, paddedBigUintB)
        expect(result, `for padded b: ${a}, ${b}`).toBe(avmResult)

        avmResult = await getAvmResult<boolean>({ appClient }, `verify_biguint_${op}`, paddedBytesA, bytesB)
        result = getStubResult(paddedBigUintA, bigUintB)
        expect(result, `for padded a: ${a}, ${b}`).toBe(avmResult)

        avmResult = await getAvmResult<boolean>({ appClient }, `verify_biguint_${op}`, paddedBytesA, paddedBytesB)
        result = getStubResult(paddedBigUintA, paddedBigUintB)
        expect(result, `for padded a and b: ${a}, ${b}`).toBe(avmResult)
      })
    })

    describe.each([
      [0, 0],
      [0, 1],
      [0, MAX_UINT64],
      [1, 0],
      [1, 1],
      [256, 512],
      [MAX_UINT512, MAX_UINT64],
    ])(`${operator} with uint64`, async (a, b) => {
      const bigUintA = asBigUint(a)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const uintB = typeof b === 'bigint' ? Uint64(b) : Uint64(b)

      it(`${a} ${operator} ${b}`, async () => {
        const avmResult = await getAvmResult<boolean>({ appClient }, `verify_biguint_${op}_uint64`, bytesA, b)
        const result = getStubResult(bigUintA, uintB)
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      })
    })

    describe.each([
      [MAX_UINT512 + 1n, 1],
      [1, MAX_UINT512 + 1n],
      [MAX_UINT512 + 1n, MAX_UINT512],
      [MAX_UINT512, MAX_UINT512 + 1n],
      [MAX_UINT512 + 1n, MAX_UINT512 + 1n],
    ])(`${operator} with overflowing input`, async (a, b) => {
      const bytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      const bytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b))
      const bigUintA = BigUint(Bytes(bytesA))
      const bigUintB = BigUint(Bytes(bytesB))

      it(`${a} ${operator} ${b}`, async () => {
        await expect(getAvmResult<boolean>({ appClient }, `verify_biguint_${op}`, bytesA, bytesB)).rejects.toThrow(
          'math attempted on large byte-array',
        )
        expect(() => getStubResult(bigUintA, bigUintB)).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

        expect(() => getStubResult(a, bigUintB)).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

        expect(() => getStubResult(bigUintA, b)).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      })
    })
  })

  describe.each([
    [0n, 0n],
    [0n, MAX_UINT512],
    [MAX_UINT512, 0n],
    [1n, 0n],
    [0n, 1n],
    [1n, 1n],
    [MAX_UINT64, MAX_UINT64],
    [1n, MAX_UINT512 - 1n],
    [MAX_UINT512 - 1n, 1n],
  ])('addition', async (a, b) => {
    it(`${a} + ${b}`, async () => {
      const bigUintA = BigUint(a)
      const bigUintB = BigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_add', bytesA, bytesB)))

      let result = bigUintA + bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      result = a + bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      result = bigUintA + b
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
    })
  })

  describe.each([
    [MAX_UINT512, 1n],
    [1n, MAX_UINT512],
    [MAX_UINT512, MAX_UINT512],
  ])('addition result overflow', async (a, b) => {
    it(`${a} + ${b}`, async () => {
      const bigUintA = BigUint(a)
      const bigUintB = BigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_add', bytesA, bytesB)))

      let result = bigUintA + bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      result = a + bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      result = bigUintA + b
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
    })
  })

  describe.each([
    [MAX_UINT512 + 1n, 1],
    [1, MAX_UINT512 + 1n],
    [MAX_UINT512 + 1n, MAX_UINT512 + 1n],
  ])('addition with overflowing input', async (a, b) => {
    const bytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
    const bytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b))
    const bigUintA = BigUint(Bytes(bytesA))
    const bigUintB = BigUint(Bytes(bytesB))

    it(`${a} + ${b}`, async () => {
      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_add', bytesA, bytesB)).rejects.toThrow(
        'math attempted on large byte-array',
      )
      expect(() => bigUintA + bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

      if (typeof a === 'bigint') {
        expect(() => a + bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }

      if (typeof b === 'bigint') {
        expect(() => bigUintA + b).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }
    })
  })

  describe.each([
    [0n, 0n],
    [1n, 0n],
    [1n, 1n],
    [MAX_UINT64, MAX_UINT64],
    [MAX_UINT512, 0n],
    [MAX_UINT512, 1n],
    [MAX_UINT512, MAX_UINT512],
  ])('subtraction', async (a, b) => {
    it(`${a} - ${b}`, async () => {
      const bigUintA = BigUint(a)
      const bigUintB = BigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_sub', bytesA, bytesB)))

      let result = bigUintA - bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      result = a - bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      result = bigUintA - b
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
    })
  })

  describe.each([
    [0n, 1n],
    [1n, 2n],
    [MAX_UINT64, MAX_UINT512],
    [0n, MAX_UINT512],
    [1n, MAX_UINT512],
  ])(`subtraction result underflow`, async (a, b) => {
    it(`${a} - ${b}`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_sub', bytesA, bytesB)).rejects.toThrow('math would have negative result')
      expect(() => bigUintA - bigUintB).toThrow('BigUint underflow')

      expect(() => a - bigUintB).toThrow('BigUint underflow')

      expect(() => bigUintA - b).toThrow('BigUint underflow')
    })
  })

  describe.each([
    [MAX_UINT512 + 1n, 1n],
    [1n, MAX_UINT512 + 1n],
    [MAX_UINT512 + 1n, MAX_UINT512 + 1n],
  ])(`subtraction with overflowing input`, async (a, b) => {
    const bytesA = internal.encodingUtil.bigIntToUint8Array(a)
    const bytesB = internal.encodingUtil.bigIntToUint8Array(b)
    const bigUintA = BigUint(Bytes(bytesA))
    const bigUintB = BigUint(Bytes(bytesB))

    it(`${a} - ${b}`, async () => {
      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_sub', bytesA, bytesB)).rejects.toThrow(
        'math attempted on large byte-array',
      )
      expect(() => bigUintA - bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

      expect(() => a - bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

      expect(() => bigUintA - b).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
    })
  })

  describe.each([
    [0, 0],
    [0, 1],
    [0, MAX_UINT512],
    [1, MAX_UINT512],
    [MAX_UINT64, MAX_UINT64],
    [2, 2],
  ])(`multiplication`, async (a, b) => {
    it(`${a} * ${b}`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_mul', bytesA, bytesB)))

      let result = bigUintA * bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      if (typeof a === 'bigint') {
        result = a * bigUintB
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }

      if (typeof b === 'bigint') {
        result = bigUintA * b
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }
    })
  })

  describe.each([
    [MAX_UINT512, 2],
    [MAX_UINT512, MAX_UINT512],
    [MAX_UINT512 / 2n, 3],
  ])(`multiplication result overflow`, async (a, b) => {
    it(`${a} * ${b}`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_mul', bytesA, bytesB)))

      let result = bigUintA * bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      if (typeof a === 'bigint') {
        result = a * bigUintB
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }

      if (typeof b === 'bigint') {
        result = bigUintA * b
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }
    })
  })

  describe.each([
    [MAX_UINT512 + 1n, 2],
    [2, MAX_UINT512 + 1n],
    [MAX_UINT512 + 1n, MAX_UINT512 + 1n],
  ])(`multiplication with overflowing input`, async (a, b) => {
    it(`${a} * ${b}`, async () => {
      const bytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      const bytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b))
      const bigUintA = BigUint(Bytes(bytesA))
      const bigUintB = BigUint(Bytes(bytesB))

      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_mul', bytesA, bytesB)).rejects.toThrow(
        'math attempted on large byte-array',
      )
      expect(() => bigUintA * bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

      if (typeof a === 'bigint') {
        expect(() => a * bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }

      if (typeof b === 'bigint') {
        expect(() => bigUintA * b).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }
    })
  })

  describe.each([
    [MAX_UINT512, 1],
    [MAX_UINT512, 2],
    [MAX_UINT512, MAX_UINT512],
    [0, MAX_UINT512],
    [1, MAX_UINT512],
    [3, 2],
  ])(`division`, async (a, b) => {
    it(`${a} / ${b}`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_div', bytesA, bytesB)))

      let result = bigUintA / bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      if (typeof a === 'bigint') {
        result = a / bigUintB
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }

      if (typeof b === 'bigint') {
        result = bigUintA / b
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }
    })
  })

  describe.each([0, 1, MAX_UINT512])(`division by zero`, async (a) => {
    it(`${a} / 0`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(0)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(0n)

      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_div', bytesA, bytesB)).rejects.toThrow('division by zero')
      expect(() => bigUintA / bigUintB).toThrow('Division by zero')

      if (typeof a === 'bigint') {
        expect(() => a / bigUintB).toThrow('Division by zero')
      }
      expect(() => bigUintA / 0n).toThrow('Division by zero')
    })
  })

  describe.each([
    [MAX_UINT512 + 1n, 2],
    [2, MAX_UINT512 + 1n],
    [MAX_UINT512 + 1n, MAX_UINT512 + 1n],
  ])(`division with overflowing input`, async (a, b) => {
    it(`${a} / ${b}`, async () => {
      const bytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      const bytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b))
      const bigUintA = BigUint(Bytes(bytesA))
      const bigUintB = BigUint(Bytes(bytesB))

      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_div', bytesA, bytesB)).rejects.toThrow(
        'math attempted on large byte-array',
      )
      expect(() => bigUintA / bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

      if (typeof a === 'bigint') {
        expect(() => a / bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }

      if (typeof b === 'bigint') {
        expect(() => bigUintA / b).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }
    })
  })

  describe.each([
    [MAX_UINT512, 1],
    [MAX_UINT512, 2],
    [MAX_UINT512, MAX_UINT64],
    [0, MAX_UINT512],
    [1, MAX_UINT512],
    [3, 2],
  ])(`modulo`, async (a, b) => {
    it(`${a} % ${b}`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, 'verify_biguint_mod', bytesA, bytesB)))
      let result = bigUintA % bigUintB
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

      if (typeof a === 'bigint') {
        result = a % bigUintB
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }

      if (typeof b === 'bigint') {
        result = bigUintA % b
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
      }
    })
  })

  describe.each([0, 1, MAX_UINT512])(`modulo by zero`, async (a) => {
    it(`${a} % 0`, async () => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(0)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(0n)

      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_mod', bytesA, bytesB)).rejects.toThrow('modulo by zero')
      expect(() => bigUintA % bigUintB).toThrow('Division by zero')

      if (typeof a === 'bigint') {
        expect(() => a % bigUintB).toThrow('Division by zero')
      }
      expect(() => bigUintA % 0n).toThrow('Division by zero')
    })
  })

  describe.each([
    [MAX_UINT512 + 1n, 2],
    [2, MAX_UINT512 + 1n],
    [MAX_UINT512 + 1n, MAX_UINT512 + 1n],
  ])(`modulo with overflowing input`, async (a, b) => {
    it(`${a} % ${b}`, async () => {
      const bytesA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      const bytesB = internal.encodingUtil.bigIntToUint8Array(BigInt(b))
      const bigUintA = BigUint(Bytes(bytesA))
      const bigUintB = BigUint(Bytes(bytesB))

      await expect(getAvmResultRaw({ appClient }, 'verify_biguint_mod', bytesA, bytesB)).rejects.toThrow(
        'math attempted on large byte-array',
      )
      expect(() => bigUintA % bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)

      if (typeof a === 'bigint') {
        expect(() => a % bigUintB).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }

      if (typeof b === 'bigint') {
        expect(() => bigUintA % b).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
      }
    })
  })

  describe.each(['and', 'or', 'xor'])('bitwise operators', async (op) => {
    const operator = (function () {
      switch (op) {
        case 'and':
          return '&'
        case 'or':
          return '|'
        case 'xor':
          return '^'
        default:
          throw new Error(`Unknown operator: ${op}`)
      }
    })()
    const getStubResult = (a: bigint | biguint, b: bigint | biguint) => {
      switch (operator) {
        case '&':
          return a & b
        case '|':
          return a | b
        case '^':
          return a ^ b
        default:
          throw new Error(`Unknown operator: ${op}`)
      }
    }
    describe.each([
      [0, 0],
      [MAX_UINT512, MAX_UINT512],
      [0, MAX_UINT512],
      [MAX_UINT512, 0],
      [42, MAX_UINT512],
      [MAX_UINT512, 42],
    ])(`${operator}`, async (a, b) => {
      const bigUintA = asBigUint(a)
      const bigUintB = asBigUint(b)
      const bytesA = internal.encodingUtil.bigIntToUint8Array(bigUintA.valueOf())
      const bytesB = internal.encodingUtil.bigIntToUint8Array(bigUintB.valueOf())

      it(`${a} ${operator} ${b}`, async () => {
        const avmResult = BigUint(abiAsBytes(await getAvmResult({ appClient }, `verify_biguint_${op}`, bytesA, bytesB)))
        let result = getStubResult(bigUintA, bigUintB)
        expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)

        if (typeof a === 'bigint') {
          result = getStubResult(a, bigUintB)
          expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
        }

        if (typeof b === 'bigint') {
          result = getStubResult(bigUintA, b)
          expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
        }
      })
    })
  })

  describe.each([MAX_UINT512 + 1n, MAX_UINT512 * 2n])('value too big', (a) => {
    it(`${a}`, () => {
      const bigUintA = asBigUint(a)
      expect(() => bigUintA === a).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
    })
  })

  describe.each([-1, -MAX_UINT512, -MAX_UINT512 * 2n])('value too small', (a) => {
    it(`${a}`, () => {
      const bigUintA = asBigUint(a)
      expect(() => bigUintA === asBigUint(a)).toThrow(BIGUINT_OVERFLOW_UNDERFLOW_MESSAGE)
    })
  })

  describe.each([
    [true, 1n],
    [false, 0n],
    [0, 0n],
    [1, 1n],
    [42, 42n],
    [0n, 0n],
    [1n, 1n],
    [42n, 42n],
    [MAX_UINT512, MAX_UINT512],
    [MAX_UINT512 * 2n, MAX_UINT512 * 2n],
    [Bytes('hello'), 448378203247n],
  ])('fromCompat', async (a, b) => {
    it(`${a}`, async () => {
      const result = internal.primitives.BigUintCls.fromCompat(a)
      expect(result, `for value: ${a}`).toEqual(b)
    })
  })
})
