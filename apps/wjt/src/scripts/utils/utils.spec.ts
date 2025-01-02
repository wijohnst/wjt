import mock from 'mock-fs';
import * as utils from './utils';
import { rawPostMocks, mockFileSystem } from '../blog-post';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

describe('utils', () => {
  describe('processPosts', () => {
    test('should be defined', () => {
      expect(utils.processPosts).toBeDefined();
    });

    beforeEach(() => {
      mock({
        ...mockFileSystem,
        'src/posts/path/to/image-1.jpg': readFileSync(
          join(cwd(), 'src/posts/post_images/sample_image_200_200.jpg')
        ),
      });
    });

    afterEach(() => {
      mock.restore();
    });

    afterAll(() => {
      mock.restore();
    });

    test('should convert images', async () => {
      const handleImageConversionSpy = jest
        .spyOn(utils, 'handleImageConversion')
        .mockImplementation(() => {
          return Promise.resolve();
        });

      await utils.processPosts(['example-post.md']);
      expect(handleImageConversionSpy).toHaveBeenCalled();
    });

    test('should throw if the image cannot be converted', async () => {
      const handleImageConversionSpy = jest
        .spyOn(utils, 'handleImageConversion')
        .mockImplementation(() => {
          return Promise.reject(new Error('Image conversion failed'));
        });

      await expect(utils.processPosts(['example-post.md'])).rejects.toThrow(
        'Image conversion failed'
      );
    });
  });
});
