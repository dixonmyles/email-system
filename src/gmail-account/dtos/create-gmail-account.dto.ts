import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object for creating a Gmail Account
 *
 * Defines the data structure and validation rules for creating a Gmail Account.
 *
 * @class CreateGmailAccountDTO
 *
 * @property {string} full_name The full name of the Gmail account.
 * @property {string} email The email of the Gmail account.
 */
export class CreateGmailAccountDTO {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;
}
