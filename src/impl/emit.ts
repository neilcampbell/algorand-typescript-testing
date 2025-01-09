import { internal } from '@algorandfoundation/algorand-typescript'
import { lazyContext } from '../context-helpers/internal-context'
import { DeliberateAny } from '../typescript-helpers'
import { sha512_256 } from './crypto'
import { getArc4Encoded, getArc4TypeName } from './encoded-types'

export function emitImpl<T>(typeInfoString: string, event: T | string, ...eventProps: unknown[]) {
  let eventData
  let eventName
  if (typeof event === 'string') {
    eventData = getArc4Encoded(eventProps)
    eventName = event
    const argTypes = getArc4TypeName((eventData as DeliberateAny).typeInfo)!
    if (eventName.indexOf('(') === -1) {
      eventName += argTypes
    } else if (event.indexOf(argTypes) === -1) {
      throw internal.errors.codeError(`Event signature ${event} does not match arg types ${argTypes}`)
    }
  } else {
    eventData = getArc4Encoded(event)
    const typeInfo = JSON.parse(typeInfoString)
    const argTypes = getArc4TypeName((eventData as DeliberateAny).typeInfo)!
    eventName = typeInfo.name.replace(/.*</, '').replace(/>.*/, '') + argTypes
  }

  const eventHash = sha512_256(eventName)
  lazyContext.value.log(eventHash.slice(0, 4).concat(eventData.bytes))
}
