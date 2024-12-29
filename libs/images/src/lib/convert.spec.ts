import mock from 'mock-fs';
import { readFileSync } from 'fs';
import { convertBufferToWebp, getBufferFromPath } from './convert';
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

  describe('getBufferFromPath', () => {
    beforeEach(() => {
      mock({
        mock_images: {
          '200_200_mock.jpg': 'content',
        },
      });
    });

    afterEach(() => {
      mock.restore();
    });

    test('should be defined', () => {
      expect(getBufferFromPath).toBeDefined();
    });

    test('should return a buffer from a file path', async () => {
      const result = await getBufferFromPath('mock_images/200_200_mock.jpg');

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});
