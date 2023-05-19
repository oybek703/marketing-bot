import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'
import { getBotConfig } from './configs/bot.config'
import { ContactService } from './contact/contact.service'
import { ContactModule } from './contact/contact.module'
import { ApiModule } from './api/api.module'
import { getApiConfig } from './configs/api.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getBotConfig
    }),
    ContactModule,
    ApiModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getApiConfig
    })
  ],
  providers: [ContactService]
})
export class AppModule {}
