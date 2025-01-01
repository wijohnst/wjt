import { resizeBySet, ResizeSet } from './resize';
import { readFileSync } from 'fs';
import { join } from 'path';
describe('resize', () => {
  describe('resizeBySet', () => {
    test('should be defined', () => {
      expect(resizeBySet).toBeDefined();
    });

    test('should return the expected output', async () => {
      const target = readFileSync(
        join(__dirname, '/sample_images/200_200.jpg')
      );
      const sizeTargets: ResizeSet = [[100], [200, 200]];
      const result = await resizeBySet(target, sizeTargets);
      expect(result).toEqual({
        '100_100': expect.any(Buffer),
        '200_200': expect.any(Buffer),
      });
    });

    test('should throw an error if the target is not an image buffer', async () => {
      const target = Buffer.from('not an image');
      const sizeTargets: ResizeSet = [[100], [200, 200]];
      await expect(async () => {
        await resizeBySet(target, sizeTargets);
      }).rejects.toThrow();
    });
  });
});
