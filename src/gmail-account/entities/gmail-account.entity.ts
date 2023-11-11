import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entity class for the Gmail accounts.
 *
 * Class maps to the database table 'gmail_accounts'.
 * Defines schema for storing Gmail accounts in the database.
 * Includes user details and OAuth2 token for accessing the Gmail API.
 *
 * @class GmailAccount
 *
 * @property {string} id The ID of the Gmail account.
 * @property {string} full_name The full name of the Gmail account.
 * @property {string} email The email of the Gmail account.
 * @property {string} [access_token] The access token for the Gmail account.
 * @property {string} [refresh_token] The refresh token for the Gmail account.
 * @property {string} [token_type] The token type for the Gmail account.
 * @property {string} [scope] The scope for the Gmail account.
 * @property {number} [expiry_date] The expiry date for the Gmail account.
 *
 * @see {@link https://typeorm.io/#/entities}
 */
@Entity('gmail_accounts')
export class GmailAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  access_token?: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token?: string;

  @Column({ type: 'varchar', nullable: true })
  token_type?: string;

  @Column({ type: 'varchar', nullable: true })
  scope?: string;

  @Column({ type: 'bigint', nullable: true })
  expiry_date?: number;
}
