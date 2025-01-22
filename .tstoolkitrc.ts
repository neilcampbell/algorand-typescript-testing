import type { TsToolkitConfig } from '@makerx/ts-toolkit'

const config: TsToolkitConfig = {
  packageConfig: {
    srcDir: 'src',
    outDir: 'dist',
    moduleType: 'module',
    exportTypes: 'module',
    main: 'index.ts',
    exports: {
      '.': 'index.ts',
      './runtime-helpers': 'runtime-helpers.ts',
      './internal': 'internal.ts',
      './internal/arc4': 'internal-arc4.ts',
      './internal/op': 'internal-op.ts',
      './test-transformer': 'test-transformer/index.ts',
    },
  },
}
export default config
