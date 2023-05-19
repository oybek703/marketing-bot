import { ConfigService } from '@nestjs/config'
import { EnvVariables } from '../common/constants'
import { CacheModuleOptions, CacheStore } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'

export const getCacheConfig = async (configService: ConfigService): Promise<CacheModuleOptions> => {
  const redisHost = configService.get(EnvVariables.redisHost)
  const redisPort = configService.get(EnvVariables.redisPort)
  if (!redisHost || !redisPort) {
    throw new Error('Error while connecting to Redis cache.')
  }
  return {
    store: redisStore as unknown as CacheStore,
    host: redisHost,
    port: redisPort
  }
}
