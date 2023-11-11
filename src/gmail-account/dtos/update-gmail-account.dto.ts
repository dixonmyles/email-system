import { PartialType } from '@nestjs/mapped-types';
import { CreateGmailAccountDTO } from './create-gmail-account.dto';

/**
 * Data Transfer Object for updating a Gmail Account.
 *
 * This class extends the CreateGmailAccountDTO class and inherits its properties and validation rules.
 * Using PartialType, all of the properties of this class are made optional without having to redefine them.
 *
 * @class UpdateGmailAccountDTO
 * @extends {PartialType(CreateGmailAccountDTO)}
 */
export class UpdateGmailAccountDTO extends PartialType(CreateGmailAccountDTO) {}
