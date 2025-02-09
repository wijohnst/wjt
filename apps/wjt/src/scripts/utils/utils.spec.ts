import mock from 'mock-fs';
import * as utils from './utils';
import { mockFileSystem, BlogPost } from '../blog-post';
import fs from 'fs';
import { join } from 'path';
import { cwd } from 'process';

import { getRawBlogPost } from '../blog-post';

describe('utils', () => {
  describe('processPosts', () => {
    test('should be defined', () => {
      expect(utils.processPosts).toBeDefined();
    });

    beforeEach(() => {
      mock({
        ...mockFileSystem,
        'src/posts/path/to/image-1.jpg': fs.readFileSync(
          join(cwd(), 'src/posts/post_images/sample_image_200_200.jpg')
        ),
      });
    });

    afterEach(() => {
      mock.restore();
    });

    afterAll(() => {
      mock.restore();
      jest.restoreAllMocks();
    });

    test('should convert images', async () => {
      jest.spyOn(utils, 'handleImageConversion').mockImplementation(() => {
        return Promise.resolve();
      });

      await utils.processPosts(['example-post.md']);

      expect(utils.handleImageConversion).toHaveBeenCalledWith(
        'example-post.md',
        expect.any(BlogPost)
      );
    });

    test('should write the processed post to the file system', async () => {
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

      await utils.processPosts(['example-post.md']);

      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        join('src/posts', 'post-1.html'),
        expect.any(String)
      );

      writeFileSyncSpy.mockRestore();
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

      handleImageConversionSpy.mockRestore();
    });
  });
});
