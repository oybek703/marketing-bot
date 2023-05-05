import { ConfigService } from '@nestjs/config'
import { TelegrafModuleOptions } from 'nestjs-telegraf/dist/interfaces/telegraf-options.interface'
import { session } from 'telegraf'

export const getBotConfig = async (configService: ConfigService): Promise<TelegrafModuleOptions> => {
  const token = configService.get('BOT_TOKEN')
  if (!token) {
    throw new Error('BOT_TOKEN is required!')
  }
  return {
    token,
    middlewares: [session()]
  }
}
