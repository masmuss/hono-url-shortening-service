import { Context } from 'hono'
import { ZodError } from 'zod'
import { HTTPException } from 'hono/http-exception'

export function errorHandler(err: any, ctx: Context) {
  if (err instanceof ZodError) {
    ctx.status(400)
    return ctx.json({
      errors: err.errors,
    })
  } else if (err instanceof HTTPException) {
    ctx.status(err.status)
    return ctx.json({
      error: err.message,
    })
  } else {
    ctx.status(500)
    return ctx.json({
      error: err.message,
    })
  }
}