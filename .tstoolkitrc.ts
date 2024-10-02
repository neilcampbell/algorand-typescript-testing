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
      './test-transformer': 'test-transformer.ts',
    },
  },
}
export default config
