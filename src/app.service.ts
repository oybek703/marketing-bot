import { Injectable } from '@nestjs/common'
import { Start, Update } from 'nestjs-telegraf'
import { Context } from 'telegraf'

@Update()
@Injectable()
export class AppService {
  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome to marketing bot! ✋')
  }
}
