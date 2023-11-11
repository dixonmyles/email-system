import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GmailAccount } from './entities/gmail-account.entity';
import { CreateGmailAccountDTO } from './dtos/create-gmail-account.dto';
import { UpdateGmailAccountDTO } from './dtos/update-gmail-account.dto';
import getOAuth2Client from '../shared/utils/getOAuth2Client';
import { customMessageResponse } from '../shared/responses/customMessage.responses';
import { MESSAGE } from '../shared/utils/constants';
import { responseMessageInterface } from '../shared/utils/interfaces';

@Injectable()
export class GmailAccountService {
  constructor(
    @InjectRepository(GmailAccount)
    private gmailAccountRepository: Repository<GmailAccount>,
  ) {}

  /**
   * Creates a new Gmail account with the provided data and returns the OAuth2 URL for user email access.
   * @param dto The data for the new Gmail account.
   * @returns An object containing a success message and the OAuth2 URL for user email access.
   */
  async create(dto: CreateGmailAccountDTO): Promise<responseMessageInterface> {
    try {
      const gmailAccount = this.gmailAccountRepository.create(dto);
      await this.gmailAccountRepository.save(gmailAccount);
      // OAuth 2 call for getting user email access
      const oAuth2Client = getOAuth2Client();
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://mail.google.com/'],
        state: dto.email,
      });
      return customMessageResponse(HttpStatus.CREATED, MESSAGE.SUCCESS, {
        authUrl,
      });
    } catch (error) {
      return customMessageResponse(HttpStatus.BAD_REQUEST, MESSAGE.BAD_REQUEST);
    }
  }

  /**
   * Updates an existing Gmail account with the provided data.
   * @param id The ID of the Gmail account to update.
   * @param dto The data to update the Gmail account with.
   * @returns An object containing a success message and the updated Gmail account.
   */
  async update(
    id: string,
    dto: UpdateGmailAccountDTO,
  ): Promise<responseMessageInterface> {
    try {
      await this.gmailAccountRepository.update(id, dto);
      return customMessageResponse(
        HttpStatus.OK,
        MESSAGE.SUCCESS,
        await this.gmailAccountRepository.findOne({ where: { id } }),
      );
    } catch (error) {
      return customMessageResponse(HttpStatus.BAD_REQUEST, MESSAGE.BAD_REQUEST);
    }
  }

  /**
   * Gets the webhook for the provided code and state.
   * @param query An object containing the code and state for the webhook.
   * @returns An object containing a success message and the email of the Gmail account that was updated.
   */
  async getWebhook(query: {
    code: string;
    state: string;
  }): Promise<responseMessageInterface> {
    const oAuth2Client = getOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(query.code);

    const gmailAccount = await this.gmailAccountRepository.findOne({
      where: { email: query.state },
    });

    const updates = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      expiry_date: tokens.expiry_date,
      token_type: tokens.token_type,
    };

    await this.gmailAccountRepository.save({
      ...gmailAccount, // the existing account
      ...updates, // the new updates
    });

    return customMessageResponse(
      HttpStatus.OK,
      'Gmail account updated successfully.',
      { email: gmailAccount.email },
    );
  }

  /**
   * Checks if the provided token is expired.
   * @param tokenExpiryDate The expiry date of the token.
   * @returns A boolean indicating whether the token is expired.
   */
  public isTokenExpired(tokenExpiryDate: number): boolean {
    return tokenExpiryDate <= Date.now();
  }

  /**
   * Refreshes the provided token and returns the updated credentials.
   * @param token The token to refresh.
   * @returns The updated credentials.
   */
  public async refreshToken(token: any): Promise<any> {
    const oAuth2Client = getOAuth2Client(token);
    const refreshedTokenResponse = await oAuth2Client.refreshAccessToken();
    return refreshedTokenResponse.credentials;
  }

  /**
   * Updates the token for the Gmail account with the provided ID.
   * @param id The ID of the Gmail account to update.
   * @param updatedToken The updated token to save.
   */
  public async updateTokenInDB(id: string, updatedToken: any): Promise<void> {
    const user = await this.gmailAccountRepository.findOne({ where: { id } });
    if (user) {
      await this.gmailAccountRepository.update(user.email, updatedToken);
    }
  }

  /**
   * Gets the token for the Gmail account with the provided ID from the database.
   * @param id The ID of the Gmail account to get the token for.
   * @returns The token for the Gmail account, or null if the account is not found.
   */
  public async getTokenFromDB(id: string): Promise<{
    access_token: string;
    refresh_token: string;
    scope: string;
    expiry_date: number;
    token_type: string;
  } | null> {
    const user = await this.gmailAccountRepository.findOne({ where: { id } });
    if (user) {
      return {
        access_token: user.access_token,
        refresh_token: user.refresh_token,
        scope: user.scope,
        expiry_date: user.expiry_date,
        token_type: user.token_type,
      };
    }

    return null;
  }

  /**
   * Validates the token for the Gmail account with the provided ID and returns an updated token if it is expired.
   * @param id The ID of the Gmail account to validate the token for.
   * @returns The updated token, or null if the account is not found.
   */
  public async validateToken(id: string): Promise<any> {
    const token = await this.getTokenFromDB(id);
    if (token) {
      if (this.isTokenExpired(token.expiry_date)) {
        const credentials = await this.refreshToken(token);

        const updatedToken = {
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token || token.refresh_token,
          expiry_date: credentials.expiry_date || token.expiry_date,
          token_type: credentials.token_type || token.token_type,
        };

        await this.updateTokenInDB(id, updatedToken);
        return updatedToken;
      }
      return token;
    }
    return null;
  }
}
