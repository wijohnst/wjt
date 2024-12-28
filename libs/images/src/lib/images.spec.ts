import { isCdnImage } from './images';

describe('images', () => {
  describe('isCdnImage', () => {
    test('should be defined', () => {
      expect(isCdnImage).toBeDefined();
    });
  });
});
