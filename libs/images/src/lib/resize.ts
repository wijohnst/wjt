import sharp from 'sharp';

export type ResizeHeight = number;
export type ResizeWidth = number;

export type ResizeValue = [ResizeHeight, ResizeWidth] | [ResizeWidth];
export type ResizeSet = ResizeValue[];

export type ResizeBySetOutput = Record<string, Buffer>;

/**
 * Accepts a buffer and resizes it to the specified sizes, and then returns the new buffers in an object with the size as the key and the resized buffer as the value
 * e.g. { '100_100': Buffer, '200_200': Buffer } represents a 100x100 and 200x200 resized image respectively
 * @param {Buffer} target
 * @param {ResizeSet} sizeTargets
 * @returns {Promise<ResizeBySetOutput>}
 */
export const resizeBySet = async (
  target: Buffer,
  sizeTargets: ResizeSet
): Promise<ResizeBySetOutput> => {
  const output: ResizeBySetOutput = {};

  for (const sizeTarget of sizeTargets) {
    const [width, height] = sizeTarget;
    const size = height ? `${width}_${height}` : `${width}_${width}`;

    output[size] = await sharp(target).resize(width, height).toBuffer();
  }

  return output;
};

/**
 * Simple resize function that accepts a buffer and resizes it to the specified width and height
 * @param {number} width
 * @param {number} height
 * @param {Buffer} source
 * @returns {Promise<Buffer>}
 */
export const resize = async (
  width: number,
  height: number,
  source: Buffer
): Promise<Buffer> => {
  return sharp(source).resize(width, height).toBuffer();
};
