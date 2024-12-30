import { db } from '@/db'
import { linksTable } from '@/db/schema'
import { links } from './data'

export class ShortLinkTestUtil {
  static async createShortLinks() {
    await db.insert(linksTable).values(links)
  }

  static async getShortLinkCode() {
    return db.select({
      shortCode: linksTable.shortCode,
    }).from(linksTable).limit(1).execute()
  }

  static async clearShortLinks() {
    await db.delete(linksTable)
  }
}