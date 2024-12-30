import { notFound } from 'stoker/middlewares'
import logger from './middlewares/logger'
import { PinoLogger } from 'hono-pino'
import { linkController } from '@/controllers/link.controller'
import { errorHandler } from '@/middlewares/error-handler'
import * as process from 'node:process'
import { Hono } from 'hono'

type AppBinding = {
  Variables: {
    logger: PinoLogger
  }
}

const app = new Hono<AppBinding>()

if (process.env.NODE_ENV !== 'test') app.use(logger())

app.notFound(notFound)
app.onError(errorHandler)

app.route('/api/shorten', linkController)

export default app
