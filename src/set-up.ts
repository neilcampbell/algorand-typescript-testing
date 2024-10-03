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
    function (this: TesterContext, subject, test, customTesters): boolean | undefined {
      const subjectIsPrimitive = subject instanceof internal.primitives.AlgoTsPrimitiveCls
      const testIsPrimitive = test instanceof internal.primitives.AlgoTsPrimitiveCls
      if (subjectIsPrimitive && testIsPrimitive) {
        return this.equals(subject.valueOf(), test.valueOf(), customTesters)
      } else if (subjectIsPrimitive === testIsPrimitive) {
        // Neither is primitive
        return undefined
      } else {
        // One is primitive, one is not
        return false
      }
    },
  ])
}

export function setUpTests({ expect }: { expect: ExpectObj }) {
  addEqualityTesters(expect)
}
