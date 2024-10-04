import { beforeAll, expect } from 'vitest'
import { setUpTests } from './src/set-up'

beforeAll(() => {
  setUpTests({ expect })
})
