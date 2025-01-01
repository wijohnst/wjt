import { readFileSync } from 'fs';
import { convertBufferToWebp } from './convert';
import { join } from 'path';

describe('convert', () => {
  describe('convertToWebp', () => {
    const sampleImageBuffer = readFileSync(
      join(__dirname, 'sample_images/200_200.jpg')
    );

    test('should be defined', () => {
      expect(convertBufferToWebp).toBeDefined();
    });

    test('should convert an image to webp', async () => {
      const result = await convertBufferToWebp(sampleImageBuffer);

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});
