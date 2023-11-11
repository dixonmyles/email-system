import { responseMessageInterface } from '../utils/interfaces';

/**
 * Constructs a custom message response object
 *
 * Generates a standard format for API responses. The response will contain a status code, a message, and data.
 *
 * @param statusCode The status code of the response.
 * @param message The message of the response.
 * @param data The data of the response.
 * @returns A custom message response.
 */
export function customMessageResponse(
  statusCode: number,
  message: string,
  data = {},
): responseMessageInterface {
  return {
    statusCode,
    message: [message],
    data,
  };
}
