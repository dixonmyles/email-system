import { Module } from '@nestjs/common';
import { GmailAccountController } from './gmail-account.controller';
import { GmailAccountService } from './gmail-account.service';
import { GmailAccount } from './entities/gmail-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GmailAccount])],
  controllers: [GmailAccountController],
  providers: [GmailAccountService],
})
export class GmailAccountModule {}
