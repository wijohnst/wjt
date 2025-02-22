import mock from 'mock-fs';
import { BlogImage } from './blog-image';

describe('BlogImage', () => {
  test('should be defined', () => {
    expect(BlogImage).toBeDefined();
  });

  describe('imageBuffer', () => {
    beforeEach(() => {
      mock({
        'path/to/image.jpg': Buffer.from('image data!'),
      });
    });

    test('should return a Buffer', async () => {
      const blogImage = new BlogImage('path/to/image.jpg');
      await blogImage.generateImageBuffer();

      expect(blogImage.imageBuffer).toBeInstanceOf(Buffer);
      expect(blogImage.imageBuffer).toMatchSnapshot();
    });
  });
});
