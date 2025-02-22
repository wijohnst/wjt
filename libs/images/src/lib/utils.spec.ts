import mock from 'mock-fs';
import { getBufferFromPath, isCdnImage } from './utils';

describe('utils', () => {
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

    afterAll(() => {
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

describe('images', () => {
  describe('isCdnImage', () => {
    test('should be defined', () => {
      expect(isCdnImage).toBeDefined();
    });

    test('should return true for a CDN image', () => {
      const path =
        'https://wjt.sfo2.cdn.digitaloceanspaces.com/sample_image.webp';
      const matcher = /https:\/\/wjt\.sfo2\.cdn\.digitaloceanspaces\.com\/.*/;

      expect(isCdnImage(path, matcher)).toBe(true);
    });
  });
});
