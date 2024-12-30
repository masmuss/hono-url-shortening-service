import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const linksTable = pgTable(
  'links',
  {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    shortCode: text('short_code').notNull(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      linkIndex: uniqueIndex('link_index').on(table.url),
    }
  }
)

export type Link = typeof linksTable.$inferSelect
export type LinkInsert = typeof linksTable.$inferInsert
