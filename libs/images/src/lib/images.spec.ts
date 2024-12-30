import { isCdnImage } from './images';

describe('images', () => {
  describe('isCdnImage', () => {
    test('should be defined', () => {
      expect(isCdnImage).toBeDefined();
    });

    test('should return true for a CDN image', () => {
      const path =
        'https://wjt.sfo2.cdn.digitaloceanspaces.com/sample_image.webp';
      const matcher =
        /https:\/\/wjt\.sfo2\.cdn\.digitaloceanspaces\.com\/.*\.webp/;

      expect(isCdnImage(path, matcher)).toBe(true);
    });
  });
});
