import { registerPTypes, typeRegistry } from '@algorandfoundation/puya-ts'
import type ts from 'typescript'
import type { DeliberateAny } from '../typescript-helpers'
import { SourceFileVisitor } from './visitors'

export interface TransformerConfig {
  includeExt: string[]
  testingPackageName: string
}
const defaultTransformerConfig: TransformerConfig = {
  includeExt: ['.algo.ts', '.spec.ts'],
  testingPackageName: '@algorandfoundation/algorand-typescript-testing',
}

const createProgramFactory = (config: TransformerConfig) => {
  function programFactory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    registerPTypes(typeRegistry)
    return (context) => {
      return (sourceFile) => {
        if (!config.includeExt.some((i) => sourceFile.fileName.endsWith(i))) return sourceFile
        return new SourceFileVisitor(context, sourceFile, program, config).result()
      }
    }
  }
  return programFactory
}

// Typescript.d.ts typings require a TransformerFactory however rollup plugin supports a program transformer
// https://github.com/rollup/plugins/blob/master/packages/typescript/src/customTransformers.ts
function programTransformer(config: Partial<TransformerConfig>) {
  return {
    type: 'program',
    factory: createProgramFactory({ ...defaultTransformerConfig, ...config }),
  }
}
programTransformer.type = 'program'
programTransformer.factory = createProgramFactory(defaultTransformerConfig)

/**
 * TypeScript transformer for Algorand TypeScript smart contracts and testing files
 * which is mainly responsilbe for swapping in stub implementations of op codes,
 * and capturing TypeScript type information for the Node.js runtime.
 *
 ** @type {ts.TransformerFactory<ts.SourceFile> & ((config: Partial<TransformerConfig>) => ts.TransformerFactory<ts.SourceFile>)}
 *
 * @param {Partial<TransformerConfig>} [config] Configuration options
 * @param {string[]} [config.includeExt=['.algo.ts', '.spec.ts']] File extensions to process
 * @param {string} [config.testingPackageName='@algorandfoundation/algorand-typescript-testing'] Package name for testing imports
 *
 * @example
 * // Use as factory function with custom config in vitest.config.mts
 * import typescript from '@rollup/plugin-typescript'
 * import { defineConfig } from 'vitest/config'
 * import { puyaTsTransformer } from '@algorandfoundation/algorand-typescript-testing/test-transformer'
 *
 * export default defineConfig({
 *   esbuild: {},
 *   plugins: [
 *     typescript({
 *       tsconfig: './tsconfig.json',
 *       transformers: {
 *         before: [puyaTsTransformer],
 *       },
 *     }),
 *   ],
 * })
 */
export const puyaTsTransformer: ts.TransformerFactory<ts.SourceFile> &
  ((config: Partial<TransformerConfig>) => ts.TransformerFactory<ts.SourceFile>) = programTransformer as DeliberateAny
