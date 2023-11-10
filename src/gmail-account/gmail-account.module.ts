import { Module } from '@nestjs/common';
import { GmailAccountController } from './gmail-account.controller';
import { GmailAccountService } from './gmail-account.service';

@Module({
  controllers: [GmailAccountController],
  providers: [GmailAccountService],
})
export class GmailAccountModule {}
