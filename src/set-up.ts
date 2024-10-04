import { internal } from '@algorandfoundation/algorand-typescript'

type Tester = (this: TesterContext, a: unknown, b: unknown, customTesters: Array<Tester>) => boolean | undefined
interface TesterContext {
  equals: (a: unknown, b: unknown, customTesters?: Array<Tester>, strictCheck?: boolean) => boolean
}
interface ExpectObj {
  addEqualityTesters: (testers: Array<Tester>) => void
}

function addEqualityTesters(expectObj: ExpectObj) {
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
      } else if (test instanceof internal.primitives.Uint64Cls || test instanceof internal.primitives.BigUintCls) {
        const subjectValue = typeof subject === 'bigint' ? subject : typeof subject === 'number' ? BigInt(subject) : undefined
        if (subjectValue !== undefined) return this.equals(subjectValue, test.valueOf(), customTesters)
        return undefined
      }
      // Defer to other testers
      return undefined
    },
  ])
}

export function setUpTests({ expect }: { expect: ExpectObj }) {
  addEqualityTesters(expect)
}
