import { internal } from '@algorandfoundation/algorand-typescript'
import { MAX_UINT64 } from './constants'
import type { TypeInfo } from './encoders'
import { DeliberateAny } from './typescript-helpers'
import { nameOfType } from './util'

export { attachAbiMetadata } from './abi-metadata'

export function switchableValue(x: unknown): bigint | string | boolean {
  if (typeof x === 'boolean') return x
  if (typeof x === 'bigint') return x
  if (typeof x === 'string') return x
  if (x instanceof internal.primitives.AlgoTsPrimitiveCls) return x.valueOf()
  internal.errors.internalError(`Cannot convert ${nameOfType(x)} to switchable value`)
}
// export function wrapLiteral(x: unknown) {
//   if (typeof x === 'boolean') return x
//   if (isBytes(x)) return makeBytes(x)
//   if (isUint64(x)) return makeUint64(x)
//   internalError(`Cannot wrap ${nameOfType(x)}`)
// }

type BinaryOps =
  | '+'
  | '-'
  | '*'
  | '**'
  | '/'
  | '%'
  | '>'
  | '>='
  | '<'
  | '<='
  | '==='
  | '!=='
  | '<<'
  | '>>'
  | '&'
  | '|'
  | '^'
  | '+='
  | '-='
  | '/='
  | '*='
  | '**='
  | '%='
type UnaryOps = '~'

function tryGetBigInt(value: unknown): bigint | undefined {
  if (typeof value == 'bigint') return value
  if (typeof value == 'number') return BigInt(value)
  if (value instanceof internal.primitives.Uint64Cls) return value.valueOf()
  if (value instanceof internal.primitives.BigUintCls) return value.valueOf()
  return undefined
}

export function binaryOp(left: unknown, right: unknown, op: BinaryOps) {
  if (left instanceof internal.primitives.BigUintCls || right instanceof internal.primitives.BigUintCls) {
    return bigUintBinaryOp(left, right, op)
  }
  if (left instanceof internal.primitives.Uint64Cls || right instanceof internal.primitives.Uint64Cls) {
    return uint64BinaryOp(left, right, op)
  }
  if (left instanceof internal.primitives.BytesCls || right instanceof internal.primitives.BytesCls) {
    return bytesBinaryOp(left, right, op)
  }
  const lbi = tryGetBigInt(left)
  const rbi = tryGetBigInt(right)
  if (lbi !== undefined && rbi !== undefined) {
    const result = defaultBinaryOp(lbi, rbi, op)

    if (typeof result === 'boolean') {
      return result
    }

    if (typeof left === 'number' && typeof right === 'number' && result <= Number.MAX_SAFE_INTEGER) {
      return Number(result)
    }

    return result
  }
  return defaultBinaryOp(left, right, op)
}

export function unaryOp(operand: unknown, op: UnaryOps) {
  if (operand instanceof internal.primitives.Uint64Cls) {
    return uint64UnaryOp(operand, op)
  }
  return defaultUnaryOp(operand, op)
}

function uint64BinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  const lbi = internal.primitives.Uint64Cls.fromCompat(left).valueOf()
  const rbi = internal.primitives.Uint64Cls.fromCompat(right).valueOf()
  const result = (function () {
    switch (op) {
      case '+':
      case '+=':
        return lbi + rbi
      case '-':
      case '-=':
        return lbi - rbi
      case '*':
      case '*=':
        return lbi * rbi
      case '**':
      case '**=':
        if (lbi === 0n && rbi === 0n) {
          throw internal.errors.codeError('0 ** 0 is undefined')
        }
        return lbi ** rbi
      case '/':
      case '/=':
        return lbi / rbi
      case '%':
      case '%=':
        return lbi % rbi
      case '>>':
        if (rbi > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (lbi >> rbi) & MAX_UINT64
      case '<<':
        if (rbi > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (lbi << rbi) & MAX_UINT64
      case '>':
        return lbi > rbi
      case '<':
        return lbi < rbi
      case '>=':
        return lbi >= rbi
      case '<=':
        return lbi <= rbi
      case '===':
        return lbi === rbi
      case '!==':
        return lbi !== rbi
      case '&':
        return lbi & rbi
      case '|':
        return lbi | rbi
      case '^':
        return lbi ^ rbi
      default:
        internal.errors.internalError(`Unsupported operator ${op}`)
    }
  })()
  return typeof result === 'boolean' ? result : new internal.primitives.Uint64Cls(result)
}

function bigUintBinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  const lbi = internal.primitives.checkBigUint(internal.primitives.BigUintCls.fromCompat(left).valueOf())
  const rbi = internal.primitives.checkBigUint(internal.primitives.BigUintCls.fromCompat(right).valueOf())
  const result = (function () {
    switch (op) {
      case '+':
      case '+=':
        return lbi + rbi
      case '-':
      case '-=':
        return lbi - rbi
      case '*':
      case '*=':
        return lbi * rbi
      case '**':
      case '**=':
        if (lbi === 0n && rbi === 0n) {
          throw internal.errors.codeError('0 ** 0 is undefined')
        }
        return lbi ** rbi
      case '/':
      case '/=':
        return lbi / rbi
      case '%':
      case '%=':
        return lbi % rbi
      case '>>':
        throw new internal.errors.CodeError('BigUint does not support >> operator')
      case '<<':
        throw new internal.errors.CodeError('BigUint does not support << operator')
      case '>':
        return lbi > rbi
      case '<':
        return lbi < rbi
      case '>=':
        return lbi >= rbi
      case '<=':
        return lbi <= rbi
      case '===':
        return lbi === rbi
      case '!==':
        return lbi !== rbi
      case '&':
        return lbi & rbi
      case '|':
        return lbi | rbi
      case '^':
        return lbi ^ rbi
      default:
        internal.errors.internalError(`Unsupported operator ${op}`)
    }
  })()
  if (typeof result === 'boolean') {
    return result
  }

  if (result < 0) {
    internal.errors.avmError('BigUint underflow')
  }
  return new internal.primitives.BigUintCls(result)
}

function bytesBinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  const lbb = internal.primitives.checkBytes(internal.primitives.BytesCls.fromCompat(left).asUint8Array())
  const rbb = internal.primitives.checkBytes(internal.primitives.BytesCls.fromCompat(right).asUint8Array())
  const lbi = internal.encodingUtil.uint8ArrayToBigInt(lbb)
  const rbi = internal.encodingUtil.uint8ArrayToBigInt(rbb)

  const result = (function () {
    switch (op) {
      case '>':
        return lbi > rbi
      case '<':
        return lbi < rbi
      case '>=':
        return lbi >= rbi
      case '<=':
        return lbi <= rbi
      case '===':
        return lbi === rbi
      case '!==':
        return lbi !== rbi
      default:
        internal.errors.internalError(`Unsupported operator ${op}`)
    }
  })()
  return result
}

function defaultBinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  switch (op) {
    case '+':
    case '+=':
      return left + right
    case '-':
    case '-=':
      return left - right
    case '*':
    case '*=':
      return left * right
    case '**':
    case '**=':
      if (left === 0n && right === 0n) {
        throw new internal.errors.CodeError('0 ** 0 is undefined')
      }
      return left ** right
    case '/':
    case '/=':
      return left / right
    case '%':
    case '%=':
      return left % right
    case '>>':
      if (typeof left === 'bigint' && typeof right === 'bigint') {
        if (right > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (left >> right) & MAX_UINT64
      }
      return left >> right
    case '<<':
      if (typeof left === 'bigint' && typeof right === 'bigint') {
        if (right > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (left << right) & MAX_UINT64
      }
      return left << right
    case '>':
      return left > right
    case '<':
      return left < right
    case '>=':
      return left >= right
    case '<=':
      return left <= right
    case '===':
      return left === right
    case '!==':
      return left !== right
    case '&':
      return left & right
    case '|':
      return left | right
    case '^':
      return left ^ right
    default:
      internal.errors.internalError(`Unsupported operator ${op}`)
  }
}

function uint64UnaryOp(operand: DeliberateAny, op: UnaryOps): DeliberateAny {
  const obi = internal.primitives.Uint64Cls.fromCompat(operand).valueOf()
  switch (op) {
    case '~':
      return ~obi & MAX_UINT64
    default:
      internal.errors.internalError(`Unsupported operator ${op}`)
  }
}

function defaultUnaryOp(_operand: DeliberateAny, op: UnaryOps): DeliberateAny {
  internal.errors.internalError(`Unsupported operator ${op}`)
}

const genericTypeMap = new WeakMap<DeliberateAny, TypeInfo>()
export function captureGenericTypeInfo(target: DeliberateAny, t: string) {
  genericTypeMap.set(target, JSON.parse(t))
  return target
}

export function getGenericTypeInfo(target: DeliberateAny): TypeInfo | undefined {
  return genericTypeMap.get(target)
}
