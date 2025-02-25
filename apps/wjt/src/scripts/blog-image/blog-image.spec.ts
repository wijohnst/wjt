import mock from 'mock-fs';
import {
  BlogImage,
  calculateAspectRatio,
  generateSrcSet,
  isValidSourceSetString,
  generateSourceSetString,
} from './blog-image';
import {
  parseMarkdownString,
  getImageNodes,
} from '../blog-post/image-naming-spec/test-utils';
import {
  DEFAULT_CDN_MATCHER,
  WJT_SPACES_CDN_ENDPOINT,
} from '../wjt-spaces-client';

describe('BlogImage', () => {
  test('should be defined', () => {
    expect(BlogImage).toBeDefined();
  });

  let sut: BlogImage;

  beforeEach(() => {
    const parentNode = parseMarkdownString(
      '![alt-text$200x200](./path/to/image.jpg)'
    );
    const [node] = getImageNodes(parentNode);

    mock({
      'path/to/image.jpg': Buffer.from('image data'),
    });

    sut = new BlogImage(node, DEFAULT_CDN_MATCHER, WJT_SPACES_CDN_ENDPOINT, [
      200,
    ]);
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

  describe('imageBuffer', () => {
    test('should return a Buffer', async () => {
      await sut.generateImageBuffer();

      expect(sut.imageBuffer).toBeInstanceOf(Buffer);
    });
  });

  describe('isCDNImage', () => {
    test('should be defined', () => {
      expect(sut.isCDNPath).toBeDefined();
    });

    test('should return false for a local image path', () => {
      expect(sut.isCDNPath).toBe(false);
    });

    test('should return true for a CDN image path', () => {
      const cdnMatcher = /cdn\.example\.com/;
      const cdnNode = parseMarkdownString(
        '![alt-text$200x200](https://cdn.example.com/image.jpg)'
      );
      const [cdnImageNode] = getImageNodes(cdnNode);

      const cdnImage = new BlogImage(cdnImageNode, cdnMatcher);

      expect(cdnImage.isCDNPath).toBe(true);
    });
  });

  describe('imageMetaData', () => {
    test('should be defined', () => {
      expect(sut.imageMetaData).toBeDefined();
    });

    test('should return the image metadata', () => {
      expect(sut.imageMetaData).toEqual({
        altText: 'alt-text',
        width: 200,
        height: 200,
      });
    });
  });

  describe('imageSrc', () => {
    test('should be defined', () => {
      expect(sut.imageSrc).toBeDefined();
    });

    test('should return the image src - local path', () => {
      expect(sut.imageSrc).toEqual('./path/to/image.jpg');
    });

    test('should return the image src - CDN path', () => {
      const cdnMatcher = /cdn\.example\.com/;
      const cdnNode = parseMarkdownString(
        '![alt-text$200x200](https://cdn.example.com/image.jpg)'
      );
      const [cdnImageNode] = getImageNodes(cdnNode);

      const cdnImage = new BlogImage(cdnImageNode, cdnMatcher);

      expect(cdnImage.imageSrc).toEqual('https://cdn.example.com/image.jpg');
    });
  });

  describe('imageName', () => {
    test('should be defined', () => {
      expect(sut.imageName).toBeDefined();
    });

    test('should return the image name - local path', () => {
      expect(sut.imageName).toEqual('image');
    });

    test('should return the image name - CDN path', () => {
      const cdnMatcher = /cdn\.example\.com/;
      const cdnNode = parseMarkdownString(
        '![alt-text$200x200](https://cdn.example.com/image.jpg)'
      );
      const [cdnImageNode] = getImageNodes(cdnNode);

      const cdnImage = new BlogImage(cdnImageNode, cdnMatcher);

      expect(cdnImage.imageName).toEqual('image');
    });
  });

  describe('sourceSet', () => {
    test('should be defined', () => {
      expect(sut.sourceSet).toBeDefined();
    });

    test('should return the correct sourceSet array', () => {
      expect(sut.sourceSet).toEqual([
        `${WJT_SPACES_CDN_ENDPOINT}/image-200w.webp 200w`,
      ]);
    });
  });

  describe('aspectRatio', () => {
    test('should be defined', () => {
      expect(sut.aspectRatio).toBeDefined();
    });

    test('should return the correct aspect ratio', () => {
      expect(sut.aspectRatio).toBe(1);
    });
  });

  describe('utils', () => {
    describe('generateSrcSet', () => {
      test('should be defined', () => {
        expect(generateSrcSet).toBeDefined();
      });

      test('should return the correct src set array', () => {
        const responsiveImageWidths = [200, 400];

        const srcSet = generateSrcSet(
          responsiveImageWidths,
          WJT_SPACES_CDN_ENDPOINT,
          'image'
        );

        expect(srcSet).toEqual([
          `${WJT_SPACES_CDN_ENDPOINT}/image-200w.webp 200w`,
          `${WJT_SPACES_CDN_ENDPOINT}/image-400w.webp 400w`,
        ]);
      });
    });

    describe('isValidSourceSetString', () => {
      test('should be defined', () => {
        expect(isValidSourceSetString).toBeDefined();
      });

      test('should return true for a valid source set string', () => {
        const sourceSetString = `${WJT_SPACES_CDN_ENDPOINT}/image-200w.webp 200w`;

        expect(isValidSourceSetString(sourceSetString)).toBe(true);
      });

      test('should return false for an invalid source set string', () => {
        const sourceSetString = 'invalid-source-set-string';

        expect(isValidSourceSetString(sourceSetString)).toBe(false);
      });
    });

    describe('generateSourceSetString', () => {
      test('should be defined', () => {
        expect(generateSourceSetString).toBeDefined();
      });

      test('should return the source set string', () => {
        const sourceSetString = `${WJT_SPACES_CDN_ENDPOINT}/image-200w.webp 200w`;

        expect(generateSourceSetString(sourceSetString)).toBe(
          sourceSetString as any
        );
      });

      test('should throw an error for an invalid source set string', () => {
        const sourceSetString = 'invalid-source-set-string';

        expect(() => generateSourceSetString(sourceSetString)).toThrow(
          'Invalid source set string'
        );
      });
    });

    describe('calculateAspectRatio', () => {
      test('should be defined', () => {
        expect(calculateAspectRatio).toBeDefined();
      });

      test('should return the correct aspect ratio', () => {
        const width = 200;
        const height = 100;

        expect(calculateAspectRatio(width, height)).toBe(2);
      });

      test('should return the correct aspect ratio for a square image', () => {
        const width = 200;
        const height = 200;

        expect(calculateAspectRatio(width, height)).toBe(1);
      });

      test('should return the correct aspect ratio for a vertical image', () => {
        const width = 100;
        const height = 200;

        expect(calculateAspectRatio(width, height)).toBe(0.5);
      });
    });
  });

  describe('getOptimizedImages', () => {
    test('should be defined', () => {
      expect(sut.getOptimizedImages).toBeDefined();
    });

    test('should call generateImageBuffer if original image buffer is not defined', async () => {
      const generateImageBufferSpy = jest.spyOn(sut, 'generateImageBuffer');

      await sut.getOptimizedImages();

      expect(generateImageBufferSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call generateImageBuffer twice if original image buffer is defined', async () => {
      const generateImageBufferSpy = jest.spyOn(sut, 'generateImageBuffer');

      await sut.generateImageBuffer();
      await sut.getOptimizedImages();

      expect(generateImageBufferSpy).toHaveBeenCalledTimes(1);
    });

    test('should return an empty array if the original image is a CDN image', async () => {
      const cdnMatcher = /cdn\.example\.com/;
      const cdnNode = parseMarkdownString(
        '![alt-text$200x200](https://cdn.example.com/image.jpg)'
      );
      const [cdnImageNode] = getImageNodes(cdnNode);

      const cdnImage = new BlogImage(cdnImageNode, cdnMatcher);

      const optimizedImages = await cdnImage.getOptimizedImages();

      expect(optimizedImages).toEqual([]);
    });
  });
});
