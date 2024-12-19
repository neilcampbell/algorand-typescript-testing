import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'
import { puyaTsTransformer } from '../src/test-transformer'

// This config allows you to build the example contracts with the test transformer applied to verify the output statically

const config: RollupOptions = {
  input: [
    'examples/calculator/contract.algo.ts',
    'examples/hello-world-abi/contract.algo.ts',
    'examples/hello-world/contract.algo.ts',
    'examples/auction/contract.algo.ts',
    'examples/voting/contract.algo.ts',
    'examples/simple-voting/contract.algo.ts',
    'examples/zk-whitelist/contract.algo.ts',
  ],
  output: [
    {
      dir: 'examples/debug-out',
      format: 'es',
      exports: 'named',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: true,
    },
  ],
  external: [/node_modules/, /tslib/, /@algorandfoundation\/algorand-typescript/],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      transformers: {
        before: [puyaTsTransformer({})],
      },
    }),
  ],
}

export default config
