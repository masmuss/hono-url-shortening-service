import { LinkInsert } from '@/db/schema'
import { generateRandomString } from '@/utils'

export const links: LinkInsert[] = [
  {
    url: 'https://www.google.com',
    shortCode: generateRandomString()
  },
  {
    url: 'https://www.facebook.com',
    shortCode: generateRandomString()
  },
  {
    url: 'https://orm.drizzle.team/docs/get-started-postgresql',
    shortCode: generateRandomString()
  }
]
