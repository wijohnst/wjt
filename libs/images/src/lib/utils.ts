import { readFileSync } from 'fs';

/**
 * Accepts a path string and returns the contents of the file as a buffer
 * @param {string} path
 * @returns {Promise<Buffer>}
 */
export const getBufferFromPath = async (path: string): Promise<Buffer> => {
  return readFileSync(path);
};

/**
 * Checks if the substring is a CDN image using the provided regular expression
 * @param {string} path
 * @param {RegExp} matcher
 * @returns {boolean}
 */
export const isCdnImage = (path: string, matcher: RegExp): boolean => {
  return matcher.test(path);
};
