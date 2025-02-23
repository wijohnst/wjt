import mock from 'mock-fs';
import { BlogImage, generateSrcSet } from './blog-image';
import {
  parseMarkdownString,
  getImageNodes,
} from '../blog-post/image-naming-spec/test-utils';
import {
  DEFAULT_CDN_MATCHER,
  WJT_SPACES_CDN_ENDPOINT,
} from '../wjt-spaces-client';

jest.mock('console');

describe('BlogImage', () => {
  test('should be defined', () => {
    expect(BlogImage).toBeDefined();
  });

  let sut: BlogImage;

  beforeEach(() => {
    const parentNode = parseMarkdownString('![alt-text$200x200](image.jpg)');
    const [node] = getImageNodes(parentNode);

    mock({
      'path/to/image.jpg': Buffer.from('image data'),
    });

    sut = new BlogImage(
      'path/to/image.jpg',
      node,
      DEFAULT_CDN_MATCHER,
      WJT_SPACES_CDN_ENDPOINT,
      [200]
    );
  });

  afterEach(() => {
    mock.restore();
  });

  describe('imageBuffer', () => {
    beforeEach(() => {});

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

      const cdnImage = new BlogImage(
        'https://cdn.example.com/image.jpg',
        cdnImageNode,
        cdnMatcher
      );

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

    test('should return the image src', () => {
      expect(sut.imageSrc).toEqual('image.jpg');
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
          'image.jpg'
        );

        expect(srcSet).toEqual([
          `${WJT_SPACES_CDN_ENDPOINT}/image-200w.webp 200w`,
          `${WJT_SPACES_CDN_ENDPOINT}/image-400w.webp 400w`,
        ]);
      });
    });
  });
});
