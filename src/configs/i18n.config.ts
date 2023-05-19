const TelegrafI18n: typeof I18n = require('telegraf-i18n')
import { resolve } from 'path'
import type { I18n } from 'telegraf-i18n'

export const i18n = new TelegrafI18n({
  useSession: true,
  defaultLanguageOnMissing: true, // implies allowMissing = true
  directory: resolve(__dirname, '../common/locales'),
  defaultLanguage: 'ru'
})
