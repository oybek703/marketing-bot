import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'
import { getBotConfig } from './configs/bot.config'
import { ContactService } from './contact/contact.service'
import { ContactModule } from './contact/contact.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getBotConfig
    }),
    ContactModule
  ],
  providers: [ContactService]
})
export class AppModule {}
