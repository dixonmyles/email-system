/**
 * Controller for Gmail Account operations.
 *
 * This class implements the methods for handling incoming Gmail Account requests, such as creating and updating Gmail Accounts, and handling the Gmail Account webhook.
 * It uses the GmailAccountService to perform these operations, abstracting away the logic from the controller.
 * The HttpExceptionFilter is used to catch any errors that occur during the request and return the appropriate response.
 * The ValidationPipe is used to validate the request body and query parameters.
 *
 * @class GmailAccountController
 * @decorator Controller - Defines the class as a NestJS Controller and specifies the path prefix for all routes defined within the class.
 * @decorator UseFilters - Defines the HttpExceptionFilter as a global filter for the class.
 * @decorator UsePipes - Defines the ValidationPipe as a global pipe for the class.
 *
 * @method create - Endpoint for creating a new Gmail account.
 * @method update - Endpoint for updating an existing Gmail account.
 * @method getWebhook - Endpoint for handling the Gmail account webhook.
 */

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GmailAccountService } from './gmail-account.service';
import { CreateGmailAccountDTO } from './dtos/create-gmail-account.dto';
import { UpdateGmailAccountDTO } from './dtos/update-gmail-account.dto';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@UsePipes(ValidationPipe)
@Controller('gmail-accounts')
export class GmailAccountController {
  constructor(private readonly gmailAccountService: GmailAccountService) {}

  @Post()
  async create(@Body() dto: CreateGmailAccountDTO) {
    return await this.gmailAccountService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGmailAccountDTO) {
    return await this.gmailAccountService.update(id, dto);
  }

  @Get('webhook')
  async getWebhook(@Query() query: { code: string; state: string }) {
    return await this.gmailAccountService.getWebhook(query);
  }
}
