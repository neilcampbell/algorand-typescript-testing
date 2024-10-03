import { expect } from 'vitest'
import { setUpTests } from './src/set-up'

export function setup() {
  setUpTests({ expect })
}
