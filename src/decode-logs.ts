import { bytes, op } from '@algorandfoundation/algorand-typescript'

export type LogDecoding = 'i' | 's' | 'b'

export type DecodedLog<T extends LogDecoding> = T extends 'i' ? bigint : T extends 's' ? string : Uint8Array
export type DecodedLogs<T extends [...LogDecoding[]]> = {
  [Index in keyof T]: DecodedLog<T[Index]>
} & { length: T['length'] }
export function decodeLogs<const T extends [...LogDecoding[]]>(logs: bytes[], decoding: T): DecodedLogs<T> {
  return logs.map((log, i) => {
    switch (decoding[i]) {
      case 'i':
        return op.btoi(log)
      case 's':
        return log.toString()
      default:
        return log
    }
  }) as DecodedLogs<T>
}
