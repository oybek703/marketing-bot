import { Module } from '@nestjs/common'
import { ContactWizard } from './scenes/wizards/contact.wizard'

@Module({
  providers: [ContactWizard]
})
export class ContactModule {}
