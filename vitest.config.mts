import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'vitest/config'
import { puyaTsTransformer } from './src/test-transformer'

export default defineConfig({
  esbuild: {},
  test: {
    setupFiles: 'vitest.setup.ts',
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      transformers: {
        before: [puyaTsTransformer],
      },
    }),
  ],
})
