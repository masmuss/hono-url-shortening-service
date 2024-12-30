import { OpenAPIHono } from '@hono/zod-openapi'
import { Context } from 'hono'
import { CreateShortLinkRequest, ShortLinkResponse } from '@/models/link'
import { LinkService } from '@/services/link.service'

export const linkController = new OpenAPIHono()

linkController.post('/', async (ctx: Context) => {
  const request = (await ctx.req.json()) as CreateShortLinkRequest
  const response: ShortLinkResponse = await LinkService.createShortLink(request)

  ctx.status(201)
  return ctx.json({
    data: response,
  })
})

linkController.get('/:shortCode', async (ctx: Context) => {
  const shortCode: string = ctx.req.param('shortCode')
  const response: ShortLinkResponse = await LinkService.getShortLink(shortCode)

  ctx.status(200)
  return ctx.json({
    data: response,
  })
})

linkController.get('/:shortCode/stats', async (ctx: Context) => {
  const shortCode: string = ctx.req.param('shortCode')
  const response: ShortLinkResponse = await LinkService.getShortLinkStats(shortCode)

  ctx.status(200)
  return ctx.json({
    data: response,
  })
})

linkController.put('/:shortCode', async (ctx: Context) => {
  const shortCode: string = ctx.req.param('shortCode')
  const request = (await ctx.req.json()) as ShortLinkResponse
  const response: ShortLinkResponse = await LinkService.updateLink(shortCode, request)

  ctx.status(200)
  return ctx.json({
    data: response,
  })
})

linkController.delete('/:shortCode', async (ctx: Context) => {
  const shortCode: string = ctx.req.param('shortCode')
  await LinkService.deleteLink(shortCode)

  ctx.status(204)
  return ctx.json({})
})
