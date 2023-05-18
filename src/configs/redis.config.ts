import { ConfigService } from '@nestjs/config'
import type RedisSessionType from 'telegraf-session-redis'
const RedisSession: typeof RedisSessionType = require('telegraf-session-redis')

export async function connectRedis(configService: ConfigService) {
  const redisHost = configService.get('REDIS_HOST')
  const redisPort = configService.get('REDIS_PORT')
  if (!redisHost || !redisPort) {
    throw new Error('Error while connecting to Redis.')
  }
  const redisSession: RedisSessionType = new RedisSession({
    store: {
      host: redisHost,
      port: redisPort
    }
  })
  return redisSession
}
