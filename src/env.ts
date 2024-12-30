import { z } from 'zod'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

expand(config())

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})

export type ENV = z.infer<typeof envSchema>
let env: ENV = envSchema.parse(process.env)
export default env
