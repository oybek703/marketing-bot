import { ConfigService } from '@nestjs/config'
import type RedisSessionType from 'telegraf-session-redis'
import { EnvVariables } from '../common/constants'
const RedisSession: typeof RedisSessionType = require('telegraf-session-redis')

export async function connectRedis(configService: ConfigService) {
  const redisHost = configService.get(EnvVariables.redisHost)
  const redisPort = configService.get(EnvVariables.redisPort)
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
