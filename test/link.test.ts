import app from '@/index'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { ShortLinkTestUtil } from './utils/test.util'
import { links } from './utils/data'

describe('POST /api/shorten', () => {
  beforeEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
  })

  afterEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
  })

  it('should reject requests with missing url', async () => {
    const response = await app.request('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({
        url: '',
      }),
    })

    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toBeDefined()
  })

  it('should reject requests with invalid url', async () => {
    const response = await app.request('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: 'invalid' }),
    })

    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toBeDefined()
  })

  it('should shorten a valid url', async () => {
    const response = await app.request('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://orm.drizzle.team/docs/get-started-postgresql',
      }),
    })

    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.data.url).toBe(
      'https://orm.drizzle.team/docs/get-started-postgresql',
    )
    expect(json.data.shortCode).toBeDefined()
    expect(json.data.createdAt).toBeDefined()
    expect(json.data.updatedAt).toBeDefined()
  })
})

describe('GET /api/shorten/:shortCode', () => {
  beforeEach(async () => {
    await ShortLinkTestUtil.createShortLinks()
  })

  afterEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
  })

  it('should reject requests with invalid short code', async () => {
    const response = await app.request('/api/shorten/invalid', {
      method: 'GET',
    })

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Link not found' })
  })

  it('should reject requests with non-existent short code', async () => {
    const response = await app.request('/api/shorten/NotEx1st', {
      method: 'GET',
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })

  it('should success get the original url', async () => {
    const [{ shortCode }] = await ShortLinkTestUtil.getShortLinkCode()
    const response = await app.request('/api/shorten/' + shortCode, {
      method: 'GET',
    })

    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.data.url).toBe(links[0].url)
    expect(json.data.shortCode).toBeDefined()
    expect(json.data.createdAt).toBeDefined()
    expect(json.data.updatedAt).toBeDefined()
  })
})

describe('GET /api/shorten/:shortCode/stats', () => {
  beforeEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
    await ShortLinkTestUtil.createShortLinks()
  })

  afterEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
  })

  it('should reject requests with invalid short code', async () => {
    const response = await app.request('/api/shorten/invalid/stats', {
      method: 'GET',
    })

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Link not found' })
  })

  it('should reject requests with non-existent short code', async () => {
    const response = await app.request('/api/shorten/NotEx1st/stats', {
      method: 'GET',
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })

  it('should success get the original url and response contains stats', async () => {
    const [{ shortCode }] = await ShortLinkTestUtil.getShortLinkCode()

    await app.request('/api/shorten/' + shortCode, {
      method: 'GET',
    })

    await app.request('/api/shorten/' + shortCode, {
      method: 'GET',
    })

    const response = await app.request('/api/shorten/' + shortCode + '/stats', {
      method: 'GET',
    })

    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.data.url).toBe(links[0].url)
    expect(json.data.shortCode).toBeDefined()
    expect(json.data.createdAt).toBeDefined()
    expect(json.data.updatedAt).toBeDefined()
    expect(json.data.accessCount).toBe(2)
  })
})

describe('PUT /api/shorten/:shortCode', () => {
  beforeEach(async () => {
    await ShortLinkTestUtil.createShortLinks()
  })

  afterEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
  })

  it('should reject requests with invalid short code', async () => {
    const response = await app.request('/api/shorten/invalid', {
      method: 'PUT',
      body: JSON.stringify({
        url: 'https://orm.drizzle.team/docs/get-started-postgresql',
      }),
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })

  it('should reject requests with non-existent short code', async () => {
    const response = await app.request('/api/shorten/NotEx1st', {
      method: 'PUT',
      body: JSON.stringify({ url: 'https://roadmap.sh' }),
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBe('Shorted link not found')
  })

  it('should reject requests with missing url', async () => {
    const [{ shortCode }] = await ShortLinkTestUtil.getShortLinkCode()
    const response = await app.request('/api/shorten/' + shortCode, {
      method: 'PUT',
      body: JSON.stringify({ url: '' }),
    })

    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toBeDefined()
  })

  it('should reject requests with invalid url', async () => {
    const [{ shortCode }] = await ShortLinkTestUtil.getShortLinkCode()
    const response = await app.request('/api/shorten/' + shortCode, {
      method: 'PUT',
      body: JSON.stringify({ url: 'invalid' }),
    })

    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toBeDefined()
  })

  it('should success update the original url', async () => {
    const [{ shortCode }] = await ShortLinkTestUtil.getShortLinkCode()
    const response = await app.request('/api/shorten/' + shortCode, {
      method: 'PUT',
      body: JSON.stringify({ url: 'https://roadmap.sh' }),
    })

    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.data.url).toBe('https://roadmap.sh')
    expect(json.data.shortCode).toBeDefined()
    expect(json.data.createdAt).toBeDefined()
    expect(json.data.updatedAt).toBeDefined()
  })
})

describe('DELETE /api/shorten/:shortCode', () => {
  beforeEach(async () => {
    await ShortLinkTestUtil.createShortLinks()
  })

  afterEach(async () => {
    await ShortLinkTestUtil.clearShortLinks()
  })

  it('should reject requests with invalid short code', async () => {
    const response = await app.request('/api/shorten/invalid', {
      method: 'DELETE',
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })

  it('should reject requests with non-existent short code', async () => {
    const response = await app.request('/api/shorten/NotEx1st', {
      method: 'DELETE',
    })

    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBeDefined()
  })

  it('should success delete the original url', async () => {
    const [{ shortCode }] = await ShortLinkTestUtil.getShortLinkCode()
    const response = await app.request('/api/shorten/' + shortCode, {
      method: 'DELETE',
    })

    expect(response.status).toBe(204)
  })
})
