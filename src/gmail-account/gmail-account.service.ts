import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GmailAccount } from './entities/gmail-account.entity';
import { CreateGmailAccountDTO } from './dtos/create-gmail-account.dto';
import { UpdateGmailAccountDTO } from './dtos/update-gmail-account.dto';
import getOAuth2Client from '../shared/utils/getOAuth2Client';

@Injectable()
export class GmailAccountService {
  constructor(
    @InjectRepository(GmailAccount)
    private gmailAccountRepository: Repository<GmailAccount>,
  ) {}

  async create(dto: CreateGmailAccountDTO): Promise<string> {
    const gmailAccount = this.gmailAccountRepository.create(dto);
    await this.gmailAccountRepository.save(gmailAccount);
    // OAuth 2 call for getting user email access
    const oAuth2Client = getOAuth2Client();
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://mail.google.com/'],
      state: dto.email,
    });
    return authUrl;
  }

  async update(id: string, dto: UpdateGmailAccountDTO): Promise<GmailAccount> {
    await this.gmailAccountRepository.update(id, dto);
    return await this.gmailAccountRepository.findOne({ where: { id } });
  }

  async getWebhook(query: { code: string; state: string }) {
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

    return {
      message: 'Gmail account updated successfully.',
      email: gmailAccount.email,
    };
  }

  public isTokenExpired(tokenExpiryDate: number): boolean {
    return tokenExpiryDate <= Date.now();
  }

  public async refreshToken(token: any): Promise<any> {
    const oAuth2Client = getOAuth2Client(token);
    const refreshedTokenResponse = await oAuth2Client.refreshAccessToken();
    return refreshedTokenResponse.credentials;
  }

  public async updateTokenInDB(id: string, updatedToken: any): Promise<void> {
    const user = await this.gmailAccountRepository.findOne({ where: { id } });
    if (user) {
      await this.gmailAccountRepository.update(user.email, updatedToken);
    }
  }

  // Function to get a token from the database
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

  // Function to validate the token and get an updated token if it is expired
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
