import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateGmailAccountDTO {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;
}
