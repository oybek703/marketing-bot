import { ConfigService } from '@nestjs/config'
import { TelegrafModuleOptions } from 'nestjs-telegraf/dist/interfaces/telegraf-options.interface'
import { i18n } from './i18n.config'
import LocalSession from 'telegraf-session-local'
const Session: typeof LocalSession = require('telegraf-session-local')

export const getBotConfig = async (configService: ConfigService): Promise<TelegrafModuleOptions> => {
  const token = configService.get('BOT_TOKEN')
  if (!token) {
    throw new Error('BOT_TOKEN is required!')
  }
  const localSession = new Session({ database: 'session.json' })
  return {
    token,
    middlewares: [localSession.middleware(), i18n.middleware()]
  }
}
