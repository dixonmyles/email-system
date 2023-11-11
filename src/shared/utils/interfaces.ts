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
