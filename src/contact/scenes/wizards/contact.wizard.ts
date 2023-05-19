import { contactWizardId, infoCallBackData, LanguageTexts } from '../../../common/constants'
import { BotContext } from '../../../common/interfaces/context.interfaces'
import { Composer, Markup, Scenes } from 'telegraf'
import { message } from 'telegraf/filters'
import { languageKeyboard } from '../../contact.keyboards'
import { i18n } from '../../../configs/i18n.config'
import { ApiService } from '../../../api/api.service'
import { unlink, writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'
import { join } from 'path'

export class ContactWizard extends Scenes.WizardScene<BotContext> {
  private static apiService: ApiService
  constructor(apiService: ApiService) {
    super(
      contactWizardId,
      ContactWizard.startConversation(),
      ContactWizard.chooseLanguage(),
      ContactWizard.checkPhone1(),
      ContactWizard.checkPhone2()
    )
    ContactWizard.apiService = apiService
  }

  protected static async downloadAndProcessImage(url: string, handler: (localFilePath: string) => Promise<void>) {
    const mimeType = url.split('.').pop() || 'png'
    const filename = `${randomUUID()}.${mimeType}`
    const localFilePath = join(process.cwd(), filename)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await writeFile(filename, buffer)
      await handler(localFilePath)
      await unlink(localFilePath)
    } catch (e) {
      await unlink(localFilePath)
    }
  }

  static createComposer(handler: (composer: Composer<BotContext>) => void) {
    const composer = new Composer<BotContext>()
    composer.start((ctx, next) => {
      const { startPayload } = ctx
      const { id: userId } = ctx.from
      const { users } = ctx.session
      if (users && users[userId]) {
        const { link } = users[userId]
        if (link !== startPayload) {
          ctx.scene.leave()
          delete ctx.session.users[userId]
          return ctx.scene.reenter()
        }
      }
      return next()
    })
    handler(composer)
    return composer
  }

  // step-1
  static startConversation(): Composer<BotContext> {
    return ContactWizard.createComposer(composer => {
      composer.on(message('text'), async ctx => {
        const { first_name, username, last_name, id } = ctx.message.from
        const { startPayload } = ctx
        if (!startPayload) {
          await ctx.replyWithHTML(ctx.i18n.t(LanguageTexts.error))
          return ctx.scene.leave()
        }
        if (!ctx.session.users) ctx.session.users = {}
        ctx.session.users[id] = {
          link: startPayload,
          phone: '',
          username: '',
          region_id: '',
          tg_id: id,
          tg_first_name: first_name || '',
          tg_last_name: last_name || '',
          tg_username: username || ''
        }
        await ctx.reply(ctx.i18n.t(LanguageTexts.chooseLanguage), languageKeyboard)
        return ctx.wizard.next()
      })
    })
  }

  // step-2
  static chooseLanguage(): Composer<BotContext> {
    return ContactWizard.createComposer(composer => {
      composer.on(message('text'), async ctx => {
        const availableLanguages = [LanguageTexts.ruLang, LanguageTexts.uzLang]
        const contactLang = ctx.update.message.text as LanguageTexts
        if (!availableLanguages.includes(contactLang)) {
          await ctx.reply(ctx.i18n.t(LanguageTexts.chooseLanguage))
          return
        }
        ctx.scene.session.contactLang = contactLang
        let productNotFoundText = ctx.i18n.t(LanguageTexts.productNotFound)
        let waitText = ctx.i18n.t(LanguageTexts.waitText)
        if (contactLang === LanguageTexts.uzLang) {
          productNotFoundText = i18n.t('uz', LanguageTexts.productNotFound)
          waitText = i18n.t('uz', LanguageTexts.waitText)
        }
        let answerBtnText = ctx.i18n.t(LanguageTexts.getInfo)
        const productId = ctx.session.users[ctx.message.from.id].link
        const apiRes = await this.apiService.getProduct(productId)
        if (!apiRes) {
          await ctx.reply(productNotFoundText, Markup.removeKeyboard())
          delete ctx.session.users[ctx.from.id]
          return ctx.scene.leave()
        }
        let productData = apiRes.data.ru
        let caption = productData.description
        if (contactLang === LanguageTexts.uzLang) {
          productData = apiRes.data.uz
          caption = productData.description
          answerBtnText = i18n.t('uz', LanguageTexts.getInfo)
        }
        await ContactWizard.downloadAndProcessImage(productData.poster_url, async localFilePath => {
          const { message_id: waitMessageId } = await ctx.reply(waitText, Markup.removeKeyboard())
          await ctx.deleteMessage(waitMessageId)
          await ctx.replyWithPhoto(
            { source: localFilePath },
            {
              caption,
              ...Markup.inlineKeyboard([[{ text: answerBtnText, callback_data: infoCallBackData }]])
            }
          )
        })
      })
      composer.action(infoCallBackData, async ctx => {
        const { contactLang } = ctx.scene.session
        let answerText1 = ctx.i18n.t(LanguageTexts.introduceText)
        let answerText2 = ctx.i18n.t(LanguageTexts.sendPhoneNumber)
        if (contactLang === LanguageTexts.uzLang) {
          answerText1 = i18n.t('uz', LanguageTexts.introduceText)
          answerText2 = i18n.t('uz', LanguageTexts.sendPhoneNumber)
        }
        await ctx.reply(answerText1, Markup.removeKeyboard())
        await ctx.reply(answerText2)
        return ctx.wizard.next()
      })
    })
  }

  // step-3
  static checkPhone1(): Composer<BotContext> {
    return ContactWizard.createComposer(composer => {
      composer.on(message('text'), async ctx => {
        const userPhoneNumber = ctx.message.text
        const { contactLang } = ctx.scene.session
        let answerText1 = ctx.i18n.t(LanguageTexts.error)
        let answerText2 = ctx.i18n.t(LanguageTexts.sendPhoneNumber)
        let confirmText = ctx.i18n.t(LanguageTexts.confirmPhoneNumber)
        if (contactLang === LanguageTexts.uzLang) {
          answerText1 = i18n.t('uz', LanguageTexts.error)
          answerText2 = i18n.t('uz', LanguageTexts.sendPhoneNumber)
          confirmText = i18n.t('uz', LanguageTexts.confirmPhoneNumber)
        }
        if (/^998\d{9}$/.test(userPhoneNumber)) {
          ctx.scene.session.phoneNumber = userPhoneNumber
          await ctx.reply(confirmText)
          return ctx.wizard.next()
        } else {
          await ctx.reply(answerText1)
          await ctx.reply(answerText2)
          return
        }
      })
    })
  }

  // step-4
  static checkPhone2(): Composer<BotContext> {
    return ContactWizard.createComposer(composer => {
      composer.on(message('text'), async ctx => {
        const { id } = ctx.message.from
        const { users } = ctx.session
        const { contactLang } = ctx.scene.session
        const { phoneNumber } = ctx.scene.session
        const confirmPhoneNumber = ctx.message.text
        let thanksMessage = ctx.i18n.t(LanguageTexts.thanksMessage)
        let answerText1 = ctx.i18n.t(LanguageTexts.error)
        let answerText2 = ctx.i18n.t(LanguageTexts.sendPhoneNumber)
        if (contactLang === LanguageTexts.uzLang) {
          answerText1 = i18n.t('uz', LanguageTexts.error)
          answerText2 = i18n.t('uz', LanguageTexts.sendPhoneNumber)
          thanksMessage = i18n.t('uz', LanguageTexts.thanksMessage)
        }
        if (phoneNumber === confirmPhoneNumber) {
          ctx.session.users[id] = { ...users[id], phone: confirmPhoneNumber }
          await ctx.reply(thanksMessage)
          delete ctx.session.users[id]
          return ctx.scene.leave()
        } else {
          await ctx.reply(answerText1)
          await ctx.reply(answerText2)
          return ctx.wizard.back()
        }
      })
    })
  }
}
