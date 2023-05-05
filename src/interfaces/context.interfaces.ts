import { Context, Scenes } from 'telegraf'

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
}
