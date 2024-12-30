import { Link } from '@/db/schema'

export type CreateShortLinkRequest = {
  url: string
}

export type UpdateShortLinkRequest = {
  url: string
}

export type StatsShortLinkResponse = Link

export type ShortLinkResponse = Omit<Link, 'accessCount'>

export function toStatsShortLinkResponse(link: Link): StatsShortLinkResponse {
  return link
}

export function toShortLinkResponse(link: Link): ShortLinkResponse {
  return {
    id: link.id,
    url: link.url,
    shortCode: link.shortCode,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  }
}
