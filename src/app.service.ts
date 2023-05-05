import { Injectable } from '@nestjs/common'
import { Ctx, Start, Update } from 'nestjs-telegraf'
import { BotContext } from './interfaces/context.interfaces'

@Update()
@Injectable()
export class AppService {
  @Start()
  async startCommand(@Ctx() ctx: BotContext) {
    await ctx.reply('Welcome to marketing bot! ✋')
  }
}
