/**
 * NestJS module for Gmail Account functionality.
 *
 * This module defines the controllers and services necessary for Gmail Account features.
 * It also imports the TypeORM module to allow the use of the Gmail Account entity for database operations.
 *
 * @module
 * @requires Nest JS Module, TypeORM Module
 * @class GmailAccountModule
 *
 * @method imports - Imports the TypeORM module to allow the use of the Gmail Account entity for database operations.
 * @method controllers - Defines the Gmail Account controller as a NestJS controller.
 * @method providers - Registers the Gmail Account service as a NestJS provider.
 */

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
