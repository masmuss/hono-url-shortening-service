import { ZodType, z } from 'zod'
import { CreateShortLinkRequest, UpdateShortLinkRequest } from '@/models/link'

export class LinkValidation {
  static readonly CREATE: ZodType<CreateShortLinkRequest> = z.object({
    url: z.string().url(),
  })

  static readonly GET_SHORT_LINK: ZodType<string> = z.string().regex(/^[a-zA-Z0-9]/)

  static readonly UPDATE_LINK: ZodType<UpdateShortLinkRequest> = z.object({
    url: z.string().url(),
  })
}