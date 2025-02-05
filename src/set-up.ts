import { internal } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { encodingUtil } from '@algorandfoundation/puya-ts'
import { AccountCls } from './impl/reference'

type Tester = (this: TesterContext, a: unknown, b: unknown, customTesters: Array<Tester>) => boolean | undefined
interface TesterContext {
  equals: (a: unknown, b: unknown, customTesters?: Array<Tester>, strictCheck?: boolean) => boolean
}
interface ExpectObj {
  addEqualityTesters: (testers: Array<Tester>) => void
}

function doAddEqualityTesters(expectObj: ExpectObj) {
  expectObj.addEqualityTesters([
    function IsSamePrimitiveTypeAndValue(this: TesterContext, subject, test, customTesters): boolean | undefined {
      const subjectIsPrimitive = subject instanceof internal.primitives.AlgoTsPrimitiveCls
      const testIsPrimitive = test instanceof internal.primitives.AlgoTsPrimitiveCls
      const isSamePrimitive = subjectIsPrimitive && test instanceof Object.getPrototypeOf(subject).constructor
      if (subjectIsPrimitive && testIsPrimitive) {
        if (!isSamePrimitive) return false
        return this.equals(subject.valueOf(), test.valueOf(), customTesters)
      }
      // Defer to other testers
      return undefined
    },
    function NumericPrimitiveIsNumericLiteral(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof internal.primitives.Uint64Cls || subject instanceof internal.primitives.BigUintCls) {
        const testValue = typeof test === 'bigint' ? test : typeof test === 'number' ? BigInt(test) : undefined
        if (testValue !== undefined) return this.equals(subject.valueOf(), testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function BytesPrimitiveIsUint8Array(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof internal.primitives.BytesCls) {
        const testValue = test instanceof Uint8Array ? test : undefined
        if (testValue !== undefined) return this.equals(subject.asUint8Array(), testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function BytesPrimitiveIsArray(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof internal.primitives.BytesCls) {
        const testValue =
          Array.isArray(test) && test.every((i) => typeof i === 'number' && i >= 0 && i < 256) ? new Uint8Array(test) : undefined
        if (testValue !== undefined) return this.equals(subject.asUint8Array(), testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function BytesPrimitiveIsString(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof internal.primitives.BytesCls) {
        const testValue = typeof test === 'string' ? encodingUtil.utf8ToUint8Array(test) : undefined
        if (testValue !== undefined) return this.equals(subject.asUint8Array(), testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function Uint8ArrayIsBytesPrimitive(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof Uint8Array) {
        const testValue = test instanceof internal.primitives.BytesCls ? test : undefined
        if (testValue !== undefined) return this.equals(subject, testValue.asUint8Array(), customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function AccountIsAddressStr(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof AccountCls) {
        const testValue = typeof test === 'string' ? encodingUtil.base32ToUint8Array(test).slice(0, 32) : undefined
        if (testValue !== undefined) return this.equals(subject.bytes, testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function AccountIsAddressBytes(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof AccountCls) {
        const testValue = test instanceof internal.primitives.BytesCls ? test.asUint8Array().slice(0, 32) : undefined
        if (testValue !== undefined) return this.equals(subject.bytes, testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function AddressIsAccountStr(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof Address) {
        const testValue = typeof test === 'string' ? encodingUtil.base32ToUint8Array(test).slice(0, 32) : undefined
        if (testValue !== undefined) return this.equals(subject.native.bytes, testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function AddressIsAccountBytes(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof Address) {
        const testValue = test instanceof internal.primitives.BytesCls ? test.asUint8Array().slice(0, 32) : undefined
        if (testValue !== undefined) return this.equals(subject.native.bytes, testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function AddressIsAccount(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (subject instanceof Address) {
        const testValue = test instanceof AccountCls ? test.bytes : undefined
        if (testValue !== undefined) return this.equals(subject.native.bytes, testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function BigIntIsNumber(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (typeof subject === 'bigint') {
        const testValue = typeof test === 'number' ? test : undefined
        if (testValue !== undefined) return this.equals(subject, BigInt(testValue), customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
    function NumberIsBigInt(this: TesterContext, subject, test, customTesters): boolean | undefined {
      if (typeof subject === 'number') {
        const testValue = typeof test === 'bigint' ? test : undefined
        if (testValue !== undefined) return this.equals(BigInt(subject), testValue, customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
  ])
}

/**
 * Adds custom equality testers for Algorand types to vitest's expect function.
 * This allows vitest to properly compare Algorand types such as uint64, biguint, and bytes
 * against JS native types such as number, bigint and Uint8Array, in tests.
 *
 * @param {Object} params - The parameters object
 * @param {ExpectObj} params.expect - vitest's expect object to extend with custom equality testers
 *
 * @example
 * ```ts
 * import { beforeAll, expect } from 'vitest'
 * import { addEqualityTesters } from '@algorandfoundation/algorand-typescript-testing';
 *
 * beforeAll(() => {
 *   addEqualityTesters({ expect });
 * });
 * ```
 *
 * @returns {void}
 */
export function addEqualityTesters({ expect }: { expect: ExpectObj }) {
  doAddEqualityTesters(expect)
}
