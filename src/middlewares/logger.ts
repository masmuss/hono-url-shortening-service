import { pinoLogger } from 'hono-pino'
import pino from 'pino'
import PinoPretty from 'pino-pretty'

export default function logger() {
  return pinoLogger({
    pino: pino(PinoPretty()),
    http: {
      referRequestIdKey: crypto.randomUUID(),
    },
  })
}
