import { Inject, OnModuleInit } from '@nestjs/common'
import { Ctx, InjectBot, Start, TELEGRAF_STAGE, Update } from 'nestjs-telegraf'
import { Scenes, Telegraf } from 'telegraf'
import { BotContext } from '../interfaces/context.interfaces'
import { ContactWizard } from './scenes/wizards/contact.wizard'
import { contactWizardId } from '../constants'

@Update()
export class ContactService implements OnModuleInit {
  async onModuleInit() {
    this.bot.catch((err, ctx) => {
      if (err instanceof Error) {
        console.error(`${err.message} \n ${err.stack}`)
      }
      ctx.reply('Error! Please try again later.')
    })
  }

  constructor(
    @InjectBot() private readonly bot: Telegraf<BotContext>,
    @Inject(TELEGRAF_STAGE) private readonly stage: Scenes.Stage<BotContext>
  ) {
    stage.register(new ContactWizard())
    this.bot.use(this.stage.middleware())
  }

  @Start()
  async startCommand(@Ctx() ctx: BotContext) {
    return ctx.scene.enter(contactWizardId)
  }
}
