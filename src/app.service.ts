import { Injectable } from '@nestjs/common'
import { Ctx, Start, Update } from 'nestjs-telegraf'
import { BotContext } from './interfaces/context.interfaces'
import { LanguageTexts } from './constants'

@Update()
@Injectable()
export class AppService {
  @Start()
  async startCommand(@Ctx() ctx: BotContext) {
    const { first_name } = ctx.message.from
    await ctx.replyWithHTML(ctx.i18n.t(LanguageTexts.greeting, { name: first_name }))
  }
}
