/**
 * @interface responseMessageInterface
 * @description Interface for the response message object.
 * @property {number} statusCode The status code of the response.
 * @property {string[]} message The message of the response.
 * @property {object} data The data of the response.
 */
export interface responseMessageInterface {
  statusCode: number;
  message: string[];
  data: object;
}

/**
 * Interface representing an OAuth2 token.
 *
 * @interface tokenInterface
 * @property {string} access_token The OAuth2 access token.
 * @property {string} refresh_token The OAuth2 refresh token, used to obtain a new access token.
 * @property {string} scope The OAuth2 scope granted.
 * @property {number} expiry_date The expiry date of the access token.
 * @property {string} token_type The OAuth2 token type.
 */
export interface tokenInterface {
  access_token: string;
  refresh_token: string;
  scope: string;
  expiry_date: number;
  token_type: string;
}

/**
 * Interface representing a webhook query.
 *
 * @interface webhookQueryInterface
 * @property {string} code The code for the webhook.
 * @property {string} state The state for the webhook.
 *
 * @see {@link https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1}
 */
export interface webhookQueryInterface {
  code: string;
  state: string;
}
