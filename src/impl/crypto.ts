import { arc4, bytes, Bytes, Ecdsa, gtxn, internal, MimcConfigurations, VrfVerify } from '@algorandfoundation/algorand-typescript'
import elliptic from 'elliptic'
import js_sha256 from 'js-sha256'
import js_sha3 from 'js-sha3'
import js_sha512 from 'js-sha512'
import nacl from 'tweetnacl'
import { LOGIC_DATA_PREFIX, PROGRAM_TAG } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { notImplementedError } from '../errors'
import { asBytes, asBytesCls, asUint8Array, conactUint8Arrays } from '../util'

export const sha256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha256.sha256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const sha3_256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha3.sha3_256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const keccak256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha3.keccak256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const sha512_256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha512.sha512_256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const ed25519verifyBare = (
  a: internal.primitives.StubBytesCompat,
  b: internal.primitives.StubBytesCompat,
  c: internal.primitives.StubBytesCompat,
): boolean => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const bytesB = internal.primitives.BytesCls.fromCompat(b)
  const bytesC = internal.primitives.BytesCls.fromCompat(c)
  return nacl.sign.detached.verify(bytesA.asUint8Array(), bytesB.asUint8Array(), bytesC.asUint8Array())
}

export const ed25519verify = (
  a: internal.primitives.StubBytesCompat,
  b: internal.primitives.StubBytesCompat,
  c: internal.primitives.StubBytesCompat,
): boolean => {
  const txn = lazyContext.activeGroup.activeTransaction as gtxn.ApplicationTxn
  const programBytes = asBytesCls(
    txn.onCompletion == arc4.OnCompleteAction[arc4.OnCompleteAction.ClearState] ? txn.clearStateProgram : txn.approvalProgram,
  )

  const logicSig = conactUint8Arrays(asUint8Array(PROGRAM_TAG), programBytes.asUint8Array())
  const logicSigAddress = js_sha512.sha512_256.array(logicSig)

  const addressBytes = Bytes(logicSigAddress)
  const data = LOGIC_DATA_PREFIX.concat(addressBytes).concat(asBytes(a))
  return ed25519verifyBare(data, b, c)
}

export const ecdsaVerify = (
  v: Ecdsa,
  a: internal.primitives.StubBytesCompat,
  b: internal.primitives.StubBytesCompat,
  c: internal.primitives.StubBytesCompat,
  d: internal.primitives.StubBytesCompat,
  e: internal.primitives.StubBytesCompat,
): boolean => {
  const dataBytes = internal.primitives.BytesCls.fromCompat(a)
  const sigRBytes = internal.primitives.BytesCls.fromCompat(b)
  const sigSBytes = internal.primitives.BytesCls.fromCompat(c)
  const pubkeyXBytes = internal.primitives.BytesCls.fromCompat(d)
  const pubkeyYBytes = internal.primitives.BytesCls.fromCompat(e)

  const publicKey = internal.primitives.BytesCls.fromCompat(new Uint8Array([0x04]))
    .concat(pubkeyXBytes)
    .concat(pubkeyYBytes)

  const ecdsa = new elliptic.ec(curveMap[v])
  const keyPair = ecdsa.keyFromPublic(publicKey.asUint8Array())
  return keyPair.verify(dataBytes.asUint8Array(), { r: sigRBytes.asUint8Array(), s: sigSBytes.asUint8Array() })
}

export const ecdsaPkRecover = (
  v: Ecdsa,
  a: internal.primitives.StubBytesCompat,
  b: internal.primitives.StubUint64Compat,
  c: internal.primitives.StubBytesCompat,
  d: internal.primitives.StubBytesCompat,
): readonly [bytes, bytes] => {
  if (v !== Ecdsa.Secp256k1) {
    internal.errors.internalError(`Unsupported ECDSA curve: ${v}`)
  }
  const dataBytes = internal.primitives.BytesCls.fromCompat(a)
  const rBytes = internal.primitives.BytesCls.fromCompat(c)
  const sBytes = internal.primitives.BytesCls.fromCompat(d)
  const recoveryId = internal.primitives.Uint64Cls.fromCompat(b)

  const ecdsa = new elliptic.ec(curveMap[v])
  const pubKey = ecdsa.recoverPubKey(
    dataBytes.asUint8Array(),
    { r: rBytes.asUint8Array(), s: sBytes.asUint8Array() },
    recoveryId.asNumber(),
  )

  const x = pubKey.getX().toArray('be')
  const y = pubKey.getY().toArray('be')
  return [Bytes(x), Bytes(y)]
}

export const ecdsaPkDecompress = (v: Ecdsa, a: internal.primitives.StubBytesCompat): readonly [bytes, bytes] => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)

  const ecdsa = new elliptic.ec(curveMap[v])
  const keyPair = ecdsa.keyFromPublic(bytesA.asUint8Array())
  const pubKey = keyPair.getPublic()

  const x = pubKey.getX().toArray('be')
  const y = pubKey.getY().toArray('be')
  return [Bytes(new Uint8Array(x)), Bytes(new Uint8Array(y))]
}

export const vrfVerify = (
  _s: VrfVerify,
  _a: internal.primitives.StubBytesCompat,
  _b: internal.primitives.StubBytesCompat,
  _c: internal.primitives.StubBytesCompat,
): readonly [bytes, boolean] => {
  notImplementedError('vrfVerify')
}

export const EllipticCurve = new Proxy({} as internal.opTypes.EllipticCurveType, {
  get: (_target, prop) => {
    notImplementedError(`EllipticCurve.${prop.toString()}`)
  },
})

export const mimc = (_c: MimcConfigurations, _a: internal.primitives.StubBytesCompat): bytes => {
  notImplementedError('mimc')
}

const curveMap = {
  [Ecdsa.Secp256k1]: 'secp256k1',
  [Ecdsa.Secp256r1]: 'p256',
}
