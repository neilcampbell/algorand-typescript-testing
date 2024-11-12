import { arc4, biguint, BigUint, Bytes, bytes, op, uint64 } from '@algorandfoundation/algorand-typescript'

export class PrimitiveOpsContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_uint64_init(raw_value: bytes): uint64 {
    const result = op.btoi(raw_value)
    return result
  }

  @arc4.abimethod()
  public verify_uint64_add(a: uint64, b: uint64): uint64 {
    const result: uint64 = a + b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_sub(a: uint64, b: uint64): uint64 {
    const result: uint64 = a - b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_mul(a: uint64, b: uint64): uint64 {
    const result: uint64 = a * b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_div(a: uint64, b: uint64): uint64 {
    const result: uint64 = a / b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_mod(a: uint64, b: uint64): uint64 {
    const result: uint64 = a % b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_and(a: uint64, b: uint64): uint64 {
    const result: uint64 = a & b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_or(a: uint64, b: uint64): uint64 {
    const result: uint64 = a | b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_xor(a: uint64, b: uint64): uint64 {
    const result: uint64 = a ^ b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_not(a: uint64): uint64 {
    const result: uint64 = ~a
    return result
  }

  @arc4.abimethod()
  public verify_uint64_lshift(a: uint64, b: uint64): uint64 {
    const result: uint64 = a << b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_rshift(a: uint64, b: uint64): uint64 {
    const result: uint64 = a >> b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_pow(a: uint64, b: uint64): uint64 {
    const result: uint64 = a ** b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_eq(a: uint64, b: uint64): boolean {
    const result = a === b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_ne(a: uint64, b: uint64): boolean {
    const result = a !== b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_lt(a: uint64, b: uint64): boolean {
    const result = a < b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_le(a: uint64, b: uint64): boolean {
    const result = a <= b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_gt(a: uint64, b: uint64): boolean {
    const result = a > b
    return result
  }

  @arc4.abimethod()
  public verify_uint64_ge(a: uint64, b: uint64): boolean {
    const result = a >= b
    return result
  }

  @arc4.abimethod()
  public verify_bytes_init(raw_value: uint64): bytes {
    const result = op.itob(raw_value)
    return result
  }

  @arc4.abimethod()
  public verify_bytes_add(a: bytes, b: bytes, pad_a_size: uint64, pad_b_size: uint64): bytes {
    const paddedA = op.bzero(pad_a_size).concat(a)
    const paddedB = op.bzero(pad_b_size).concat(b)
    const result = paddedA.concat(paddedB)
    const resultHash = op.sha256(result)
    return resultHash
  }

  @arc4.abimethod()
  public verify_bytes_eq(a: bytes, b: bytes): boolean {
    const result = a === b
    return result
  }

  @arc4.abimethod()
  public verify_bytes_ne(a: bytes, b: bytes): boolean {
    const result = a !== b
    return result
  }

  @arc4.abimethod()
  public verify_bytes_and(a: bytes, b: bytes): bytes {
    const result = a.bitwiseAnd(b)
    return result
  }

  @arc4.abimethod()
  public verify_bytes_or(a: bytes, b: bytes): bytes {
    const result = a.bitwiseOr(b)
    return result
  }

  @arc4.abimethod()
  public verify_bytes_xor(a: bytes, b: bytes): bytes {
    const result = a.bitwiseXor(b)
    return result
  }

  @arc4.abimethod()
  public verify_bytes_not(a: bytes, pad_size: uint64): bytes {
    const paddedA = op.bzero(pad_size).concat(a)
    const result = paddedA.bitwiseInvert()
    const resultHash = op.sha256(result)
    return resultHash
  }

  @arc4.abimethod()
  public verify_biguint_add(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint + b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_add_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint + b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_sub(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint - b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_sub_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint - b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_mul(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint * b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_mul_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint * b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_div(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint / b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_div_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint / b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_mod(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint % b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_mod_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint % b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_and(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint & b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_and_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint & b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_or(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint | b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_or_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint | b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_xor(a: bytes, b: bytes): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint ^ b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_xor_uint64(a: bytes, b: uint64): bytes {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result: biguint = a_biguint ^ b_biguint
    return Bytes(result)
  }

  @arc4.abimethod()
  public verify_biguint_eq(a: bytes, b: bytes): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint === b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_eq_uint64(a: bytes, b: uint64): boolean {
    const a_biguint = BigUint(a)
    const result = a_biguint === BigUint(b)
    return result
  }

  @arc4.abimethod()
  public verify_biguint_ne(a: bytes, b: bytes): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint !== b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_ne_uint64(a: bytes, b: uint64): boolean {
    const a_biguint = BigUint(a)
    const result = a_biguint !== BigUint(b)
    return result
  }

  @arc4.abimethod()
  public verify_biguint_lt(a: bytes, b: bytes): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint < b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_lt_uint64(a: bytes, b: uint64): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint < b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_le(a: bytes, b: bytes): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint <= b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_le_uint64(a: bytes, b: uint64): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint <= b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_gt(a: bytes, b: bytes): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint > b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_gt_uint64(a: bytes, b: uint64): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint > b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_ge(a: bytes, b: bytes): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint >= b_biguint
    return result
  }

  @arc4.abimethod()
  public verify_biguint_ge_uint64(a: bytes, b: uint64): boolean {
    const a_biguint = BigUint(a)
    const b_biguint = BigUint(b)
    const result = a_biguint >= b_biguint
    return result
  }

  // TODO: uncomment when arc4 types are available
  // @arc4.abimethod
  // public verify_log(  # noqa: PLR0913
  //     self,
  //     a: String,
  //     b: uint64,
  //     c: bytes,
  //     d: bytes,
  //     e: arc4.boolean,
  //     f: arc4.String,
  //     g: arc4.UIntN[typing.Literal[64]],
  //     h: arc4.BigUIntN[typing.Literal[256]],
  //     i: arc4.UFixedNxM[typing.Literal[32], typing.Literal[8]],
  //     j: arc4.BigUFixedNxM[typing.Literal[256], typing.Literal[16]],
  //     k: bytes,
  //     m: bytes,
  //     n: bytes,
  // ) : None:
  //     d_biguint = BigUint(d)
  //     arc4_k = arc4.StaticArray[arc4.UInt8, typing.Literal[3]].from_bytes(k)
  //     arc4_m = arc4.DynamicArray[arc4.UInt16].from_bytes(m)
  //     arc4_n = arc4.Tuple[arc4.UInt32, arc4.uint64, arc4.String].from_bytes(n)
  //     log(a, b, c, d_biguint, e, f, g, h, i, j, arc4_k, arc4_m, arc4_n, sep="-")
}
