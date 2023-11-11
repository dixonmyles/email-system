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
