import {
  CreateShortLinkRequest,
  ShortLinkResponse, StatsShortLinkResponse,
  toShortLinkResponse, toStatsShortLinkResponse,
  UpdateShortLinkRequest
} from '@/models/link'
import { LinkValidation } from '@/validators/link.validation'
import { db } from '@/db'
import { Link, linksTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { generateRandomString } from '@/utils'

export class LinkService {
  static async createShortLink(
    request: CreateShortLinkRequest,
  ): Promise<ShortLinkResponse> {
    request = LinkValidation.CREATE.parse(request)

    const linkWithSameUrl = await db
      .select({
        url: linksTable.url,
      })
      .from(linksTable)
      .where(eq(linksTable.url, request.url))

    if (linkWithSameUrl.length > 0) {
      throw new HTTPException(400, {
        message: 'Link already exists',
      })
    }

    const link = await db
      .insert(linksTable)
      .values({
        url: request.url,
        shortCode: generateRandomString(),
      })
      .returning()

    return toShortLinkResponse(link[0])
  }

  static async existingShortedList(shortCode: string): Promise<Link> {
    const [link] = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.shortCode, shortCode))

    return link
  }

  static async getShortLink(shortCode: string): Promise<ShortLinkResponse> {
    shortCode = LinkValidation.GET_SHORT_LINK.parse(shortCode)
    let link = await this.existingShortedList(shortCode)

    if (!link) {
      throw new HTTPException(404, {
        message: 'Link not found',
      })
    }

    await db
      .update(linksTable)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(linksTable.shortCode, shortCode))

    return toShortLinkResponse(link)
  }

  static async getShortLinkStats(shortCode: string): Promise<StatsShortLinkResponse> {
    shortCode = LinkValidation.GET_SHORT_LINK.parse(shortCode)

    const link = await this.existingShortedList(shortCode)

    if (!link) {
      throw new HTTPException(404, {
        message: 'Link not found',
      })
    }

    return toStatsShortLinkResponse(link)
  }

  static async updateLink(
    shortCode: string,
    request: UpdateShortLinkRequest,
  ): Promise<ShortLinkResponse> {
    request = LinkValidation.UPDATE_LINK.parse(request)

    const isExist = await this.existingShortedList(shortCode)

    if (!isExist) {
      throw new HTTPException(404, {
        message: 'Shorted link not found',
      })
    }

    const [link] = await db
      .update(linksTable)
      .set({ url: request.url })
      .where(eq(linksTable.shortCode, shortCode))
      .returning()

    return toShortLinkResponse(link)
  }

  static async deleteLink(shortCode: string): Promise<void> {
    shortCode = LinkValidation.GET_SHORT_LINK.parse(shortCode)
    const isExist = await this.existingShortedList(shortCode)

    if (!isExist) {
      throw new HTTPException(404, {
        message: 'Shorted link not found',
      })
    }

    await db.delete(linksTable).where(eq(linksTable.shortCode, shortCode))
  }
}
