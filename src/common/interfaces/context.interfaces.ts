import { Context, Scenes } from 'telegraf'
import type { I18n } from 'telegraf-i18n'
import { LanguageTexts } from '../constants'

export interface ITempUser {
  link: string
  phone: string
  username: string
  region_id: string
  tg_id: number
  tg_username: string
  tg_first_name: string
  tg_last_name: string
}

export interface BotWizardSession extends Scenes.WizardSessionData {
  contactLang: LanguageTexts
  phoneNumber: string
}

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
  users: {
    [key: number]: ITempUser
  }
}

export interface BotContext extends Context {
  myContextProp: string

  session: BotSession
  scene: Scenes.SceneContextScene<BotContext, BotWizardSession>
  wizard: Scenes.WizardContextWizard<BotContext>
  i18n: I18n
  startPayload: string
}
