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

// const programTransformer = {
//   type: 'program',
//   factory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
//     registerPTypes(typeRegistry)
//     return (context) => {
//       return (sourceFile) => {
//         if (!includes.some((i) => sourceFile.fileName.endsWith(i))) return sourceFile
//         return new SourceFileVisitor(context, sourceFile, program).result()
//       }
//     }
//   },
// }
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

function programTransformer(config: Partial<TransformerConfig>) {
  return {
    type: 'program',
    factory: createProgramFactory({ ...defaultTransformerConfig, ...config }),
  }
}
programTransformer.type = 'program'
programTransformer.factory = createProgramFactory(defaultTransformerConfig)

// Typescript.d.ts typings require a TransformerFactory however rollup plugin supports a program transformer
// https://github.com/rollup/plugins/blob/master/packages/typescript/src/customTransformers.ts
export const puyaTsTransformer: ts.TransformerFactory<ts.SourceFile> &
  ((config: Partial<TransformerConfig>) => ts.TransformerFactory<ts.SourceFile>) = programTransformer as DeliberateAny
