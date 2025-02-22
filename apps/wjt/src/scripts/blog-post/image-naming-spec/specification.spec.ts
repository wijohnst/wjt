import { parseMarkdownString, getImageNodes, getNodesArr } from './test-utils';

import {
  isCommonmarkImage,
  isAltText,
  isValidFileExtension,
  parseCommonmarkImage,
  parseMetaText,
} from './specification';

describe('Blog Image Naming Specification', () => {
  describe('isCommonmarkImage', () => {
    test('should be defined', () => {
      expect(isCommonmarkImage).toBeDefined();
    });

    test('should return true', () => {
      const markdown = '![alt text](image.jpg)';
      const parentNode = parseMarkdownString(markdown);
      const imageNodes = getImageNodes(parentNode);

      expect(imageNodes.length).toBe(1);

      imageNodes.forEach((node) => {
        expect(isCommonmarkImage(node)).toBe(true);
      });
    });

    test('should return false', () => {
      const markdown = '[link text](https://example.com)';
      const parentNode = parseMarkdownString(markdown);
      const imageNodes = getImageNodes(parentNode);

      expect(imageNodes.length).toBe(0);

      const allNodes = getNodesArr(parentNode);

      allNodes.forEach((node) => {
        expect(isCommonmarkImage(node)).toBe(false);
      });
    });
  });

  describe('parseCommonmarkImage', () => {
    test('should be defined', () => {
      expect(parseCommonmarkImage).toBeDefined();
    });

    test('should return the correct parsed image data', () => {
      const markdown = '![alt text](image.jpg)';
      const parentNode = parseMarkdownString(markdown);
      const imageNodes = getImageNodes(parentNode);

      expect(imageNodes.length).toBe(1);

      imageNodes.forEach((node) => {
        const parsedImage = parseCommonmarkImage(node);

        expect(parsedImage).toEqual({
          alt: 'alt text',
          src: 'image.jpg',
        });
      });
    });

    test('should throw - invalid node', () => {
      const markdown = '[link text](https://example.com)';
      const parentNode = parseMarkdownString(markdown);
      const imageNodes = getImageNodes(parentNode);

      expect(imageNodes.length).toBe(0);

      imageNodes.forEach((node) => {
        expect(() => parseCommonmarkImage(node)).toThrow(
          'parseCommonmarkImage Error: Node is not a valid commonmark image'
        );
      });
    });
  });
});

describe('isAltText', () => {
  test('should be defined', () => {
    expect(isAltText).toBeDefined();
  });

  test('should return true - valid alt text', () => {
    const text = 'alt-text$100x200';

    expect(isAltText(text)).toBe(true);
  });

  test('should return false - invalid alt test', () => {
    const text = 'Sample Image';

    expect(isAltText(text)).toBe(false);
  });

  test('should return false - has whitespace in alt text', () => {
    const text = 'alt text$100x200';

    expect(isAltText(text)).toBe(false);
  });

  test('should return false - has special characters in alt text', () => {
    const text = 'alt_text$100x200';

    expect(isAltText(text)).toBe(false);
  });

  test('should return false - missing `x` character', () => {
    const text = 'alttext$100200';

    expect(isAltText(text)).toBe(false);
  });

  test('should return false - capital X character', () => {
    const text = 'alttext$100X200';

    expect(isAltText(text)).toBe(false);
  });
});

describe('isValidFileExtension', () => {
  test('should be defined', () => {
    expect(isValidFileExtension).toBeDefined();
  });

  test('should return true - valid file extension - jpg', () => {
    const url = 'example.jpg';

    expect(isValidFileExtension(url)).toBe(true);
  });

  test('should return true - valid file extension - jpeg', () => {
    const url = 'example.jpeg';

    expect(isValidFileExtension(url)).toBe(true);
  });

  test('should return true - valid file extension - png', () => {
    const url = 'example.png';

    expect(isValidFileExtension(url)).toBe(true);
  });

  test('should return true - valid file extension - svg', () => {
    const url = 'example.svg';

    expect(isValidFileExtension(url)).toBe(true);
  });
});

describe('parseMetaText', () => {
  test('should be defined', () => {
    expect(parseMetaText).toBeDefined();
  });

  test('should parse meta text', () => {
    const altText = 'alt-text$100x200';

    expect(parseMetaText(altText)).toEqual({
      altText: 'alt-text',
      height: 100,
      width: 200,
    });
  });

  test('should throw', () => {
    const altText = 'alt_text$100200';

    expect(() => parseMetaText(altText)).toThrow(
      'Image naming syntax error - could not parse meta text'
    );
  });
});
