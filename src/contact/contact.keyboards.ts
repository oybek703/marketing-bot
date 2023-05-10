import { Markup } from 'telegraf'
import { LanguageTexts } from '../constants'

export const languageKeyboard = Markup.keyboard([[LanguageTexts.ruLang, LanguageTexts.uzLang]]).resize()
