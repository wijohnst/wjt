import { default as sharp } from 'sharp';

/**
 * Accepts a buffer and converts it to webp format, and then returns the new buffer
 * @param {Buffer }buffer
 * @returns {{Promise<Buffer>}}
 */
export const convertBufferToWebp = async (buffer: Buffer): Promise<Buffer> => {
  return await sharp(buffer, {}).webp().toBuffer();
};
