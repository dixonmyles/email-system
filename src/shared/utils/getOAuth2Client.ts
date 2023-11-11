import * as fs from 'fs';
import { CREDENTIALS_PATH, GMAIL_CREDS } from '../utils/constants';
import { google } from 'googleapis';

/**
 * Creates and returns an OAuth2 client using Google's OAuth2 API.
 *
 * Reads Google credentials from the Gmail credentials file and creates an OAuth2 client.
 * Optionally, the OAuth2 client can be initialized with a token.
 *
 * @param token The token to initialize the OAuth2 client with.
 * @returns An instance of google.auth.OAuth2, configured with the Google credentials or, optionally, the token provided.
 */
export default function getOAuth2Client(token: object | null = null) {
  const content = fs.readFileSync(CREDENTIALS_PATH + GMAIL_CREDS, 'utf-8');
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );
  if (token) {
    oAuth2Client.setCredentials(token);
  }

  return oAuth2Client;
}
