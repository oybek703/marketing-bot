import { Context, Scenes } from 'telegraf'
import type { I18n } from 'telegraf-i18n'

export interface BotWizardSession extends Scenes.WizardSessionData {
  myWizardSessionProp: number
}

export interface BotSession extends Scenes.WizardSession<BotWizardSession> {
  mySessionProp: number
}

export interface BotContext extends Context {
  myContextProp: string

  session: BotSession
  scene: Scenes.SceneContextScene<BotContext, BotWizardSession>
  wizard: Scenes.WizardContextWizard<BotContext>
  i18n: I18n
}
