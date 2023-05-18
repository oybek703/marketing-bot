import { contactWizardId, infoCallBackData, LanguageTexts } from '../../../constants'
import { BotContext } from '../../../interfaces/context.interfaces'
import { Composer, Markup, Scenes } from 'telegraf'
import { message } from 'telegraf/filters'
import { languageKeyboard } from '../../contact.keyboards'
import { i18n } from '../../../configs/i18n.config'

export class ContactWizard extends Scenes.WizardScene<BotContext> {
  constructor() {
    super(
      contactWizardId,
      ContactWizard.startConversation(),
      ContactWizard.chooseLanguage(),
      ContactWizard.checkPhone1(),
      ContactWizard.checkPhone2()
    )
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
          ctx.session.users = {}
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
        ctx.scene.session.contactLang = contactLang
        let answerText = ctx.i18n.t(LanguageTexts.adText)
        let answerBtnText = ctx.i18n.t(LanguageTexts.getInfo)
        if (contactLang === LanguageTexts.uzLang) {
          answerText = i18n.t('uz', LanguageTexts.adText)
          answerBtnText = i18n.t('uz', LanguageTexts.getInfo)
        }
        await ctx.replyWithPhoto('https://repost.uz/storage/uploads/6315-1653046948-adves-post-material.jpeg', {
          caption: answerText,
          ...Markup.inlineKeyboard([[{ text: answerBtnText, callback_data: infoCallBackData }]])
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
          console.log(ctx.session.users[id])
          ctx.session.users = {}
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
