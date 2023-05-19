import { ConfigService } from '@nestjs/config'
import { TelegrafModuleOptions } from 'nestjs-telegraf/dist/interfaces/telegraf-options.interface'
import { i18n } from './i18n.config'
import { EnvVariables } from '../common/constants'
import { connectRedis } from './redis.config'

export const getBotConfig = async (configService: ConfigService): Promise<TelegrafModuleOptions> => {
  const token = configService.get(EnvVariables.botToken)
  if (!token) {
    throw new Error(`${EnvVariables.botToken} is required!`)
  }
  const redisSession = await connectRedis(configService)
  return {
    token,
    middlewares: [redisSession, i18n.middleware()]
  }
}
