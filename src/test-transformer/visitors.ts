import { anyPType, ContractClassPType, FunctionPType, PType, SourceLocation, typeRegistry, TypeResolver } from '@algorandfoundation/puya-ts'
import ts from 'typescript'
import type { TypeInfo } from '../encoders'
import { DeliberateAny } from '../typescript-helpers'
import { TransformerConfig } from './index'
import { nodeFactory } from './node-factory'
import { supportedBinaryOpString, supportedPrefixUnaryOpString } from './supported-binary-op-string'

const { factory } = ts

type VisitorHelper = {
  additionalStatements: ts.Statement[]
  resolveType(node: ts.Node): PType
  sourceLocation(node: ts.Node): SourceLocation
}

export class SourceFileVisitor {
  private helper: VisitorHelper
  constructor(
    private context: ts.TransformationContext,
    private sourceFile: ts.SourceFile,
    program: ts.Program,
    private config: TransformerConfig,
  ) {
    const typeResolver = new TypeResolver(program.getTypeChecker(), program.getCurrentDirectory())

    this.helper = {
      additionalStatements: [],
      resolveType(node: ts.Node): PType {
        try {
          return typeResolver.resolve(node, this.sourceLocation(node))
        } catch {
          return anyPType
        }
      },
      sourceLocation(node: ts.Node): SourceLocation {
        return SourceLocation.fromNode(sourceFile, node, program.getCurrentDirectory())
      },
    }
  }

  public result(): ts.SourceFile {
    const updatedSourceFile = ts.visitNode(this.sourceFile, this.visit) as ts.SourceFile

    return factory.updateSourceFile(updatedSourceFile, [
      nodeFactory.importHelpers(this.config.testingPackageName),
      ...updatedSourceFile.statements,
      ...this.helper.additionalStatements,
    ])
  }

  private visit = (node: ts.Node): ts.Node => {
    if (ts.isFunctionLike(node)) {
      return new FunctionLikeDecVisitor(this.context, this.helper, node).result()
    }
    if (ts.isClassDeclaration(node)) {
      return new ClassVisitor(this.context, this.helper, node).result()
    }

    return ts.visitEachChild(node, this.visit, this.context)
  }
}

class FunctionOrMethodVisitor {
  constructor(
    protected context: ts.TransformationContext,
    protected helper: VisitorHelper,
    private isFunction?: boolean,
  ) {}
  protected visit = (node: ts.Node): ts.Node => {
    return ts.visitEachChild(this.updateNode(node), this.visit, this.context)
  }

  protected updateNode(node: ts.Node): ts.Node {
    if (ts.isSwitchStatement(node)) {
      return factory.updateSwitchStatement(node, nodeFactory.switchableValue(node.expression), node.caseBlock)
    }

    if (ts.isCaseClause(node)) {
      return factory.updateCaseClause(node, nodeFactory.switchableValue(node.expression), node.statements)
    }

    if (ts.isBinaryExpression(node)) {
      const tokenText = supportedBinaryOpString(node.operatorToken.kind)
      if (tokenText) {
        return nodeFactory.binaryOp(node.left, node.right, tokenText)
      }
    }
    if (ts.isPrefixUnaryExpression(node)) {
      const tokenText = supportedPrefixUnaryOpString(node.operator)
      if (tokenText) {
        return nodeFactory.prefixUnaryOp(node.operand, tokenText)
      }
    }
    /*
     * capture generic type info in test functions; e.g.
     * ```
     *   it('should work', () => {
     *     ctx.txn.createScope([ctx.any.txn.applicationCall()]).execute(() => {
     *       const box = Box<uint64>({key: Bytes('test-key')})
     *     })
     *   })
     * ```
     */
    if (this.isFunction && ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)) {
      const initializerNode = node.initializer
      let type = this.helper.resolveType(initializerNode)

      // `voted = LocalState<uint64>()` is resolved to FunctionPType with returnType LocalState<uint64>
      if (type instanceof FunctionPType) type = type.returnType
      if (typeRegistry.isGeneric(type)) {
        const info = getGenericTypeInfo(type)
        const updatedInitializer = nodeFactory.captureGenericTypeInfo(initializerNode, JSON.stringify(info))
        return factory.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, updatedInitializer)
      }
    }
    return node
  }
}

class FunctionLikeDecVisitor extends FunctionOrMethodVisitor {
  constructor(
    context: ts.TransformationContext,
    helper: VisitorHelper,
    private funcNode: ts.SignatureDeclaration,
  ) {
    super(context, helper, true)
  }

  public result(): ts.SignatureDeclaration {
    return ts.visitNode(this.funcNode, this.visit) as ts.SignatureDeclaration
  }
}
class MethodDecVisitor extends FunctionOrMethodVisitor {
  constructor(
    context: ts.TransformationContext,
    helper: VisitorHelper,
    private methodNode: ts.MethodDeclaration,
  ) {
    super(context, helper)
  }

  public result(): ts.MethodDeclaration {
    return ts.visitNode(this.methodNode, this.visit) as ts.MethodDeclaration
  }
}

class ClassVisitor {
  private isArc4: boolean
  constructor(
    private context: ts.TransformationContext,
    private helper: VisitorHelper,
    private classDec: ts.ClassDeclaration,
  ) {
    const classType = helper.resolveType(classDec)
    this.isArc4 = classType instanceof ContractClassPType && classType.isARC4
  }

  public result(): ts.ClassDeclaration {
    return this.visit(this.classDec) as ts.ClassDeclaration
  }

  private visit = (node: ts.Node): ts.Node => {
    if (ts.isMethodDeclaration(node)) {
      if (this.classDec.name && this.isArc4) {
        const methodType = this.helper.resolveType(node)
        if (methodType instanceof FunctionPType) {
          this.helper.additionalStatements.push(nodeFactory.attachMetaData(this.classDec.name, node, methodType))
        }
      }

      return new MethodDecVisitor(this.context, this.helper, node).result()
    }

    if (ts.isCallExpression(node)) {
      let type = this.helper.resolveType(node)

      // `voted = LocalState<uint64>()` is resolved to FunctionPType with returnType LocalState<uint64>
      if (type instanceof FunctionPType) type = type.returnType

      if (typeRegistry.isGeneric(type)) {
        const info = getGenericTypeInfo(type)
        return nodeFactory.captureGenericTypeInfo(ts.visitEachChild(node, this.visit, this.context), JSON.stringify(info))
      }
    }
    return ts.visitEachChild(node, this.visit, this.context)
  }
}

const getGenericTypeInfo = (type: PType): TypeInfo => {
  let genericArgs: TypeInfo[] | Record<string, TypeInfo> | undefined = typeRegistry.isGeneric(type)
    ? type.getGenericArgs().map(getGenericTypeInfo)
    : undefined

  if (!genericArgs || !genericArgs.length) {
    if (Object.hasOwn(type, 'items')) {
      genericArgs = (type as DeliberateAny).items.map(getGenericTypeInfo)
    } else if (Object.hasOwn(type, 'itemType')) {
      genericArgs = [getGenericTypeInfo((type as DeliberateAny).itemType)]
    } else if (Object.hasOwn(type, 'properties')) {
      genericArgs = Object.fromEntries(
        Object.entries((type as DeliberateAny).properties).map(([key, value]) => [key, getGenericTypeInfo(value as PType)]),
      )
    }
  }

  const result: TypeInfo = { name: type?.name ?? 'unknown' }
  if (genericArgs && (genericArgs.length || Object.keys(genericArgs).length)) {
    result.genericArgs = genericArgs
  }
  return result
}
