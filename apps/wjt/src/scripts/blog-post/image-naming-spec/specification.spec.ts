import { Node, Parser } from 'commonmark';

import {
  isCommonmarkImage,
  isBangBraceParam,
  isAltText,
  isValidFileExtension,
  isValidImageSyntax,
  parseMarkdownImage,
  parseMetaText,
} from './specification';

describe('Blog Image Naming Specification', () => {
  describe('1.1 - Syntax', () => {
    describe('isCommonmarkImage', () => {
      test('should be defined', () => {
        expect(isCommonmarkImage).toBeDefined();
      });

      test('should return true', () => {
        const markdown = '![alt text](image.jpg)';
        const parentNode = parseMarkdownString(markdown);
        const imageNodes = getImageNodes(parentNode);

        expect(imageNodes.length).toBe(2);

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
  });

  describe('1.2 - Image Descriptor Format - bang-brace-param', () => {
    describe('isBangBraceParam', () => {
      test('should be defined', () => {
        expect(isBangBraceParam).toBeDefined();
      });

      test('should return true - valid', () => {
        const markdown = '![alt text](image.jpg)';

        expect(isBangBraceParam(markdown)).toBe(true);
      });

      test('should return false - not an image', () => {
        const markdown = '[link text](https://example.com)';

        expect(isBangBraceParam(markdown)).toBe(false);
      });

      test('should return false - valid image, incorrect format - missing URL', () => {
        const markdown = '![alt text]';
        const parentNode = parseMarkdownString(markdown);
        const imageNodes = getImageNodes(parentNode);

        imageNodes.forEach((node) => {
          expect(isCommonmarkImage(node)).toBe(true);
        });

        expect(isBangBraceParam(markdown)).toBe(false);
      });

      test('should return false - valid image, incorrect format - missing alt text', () => {
        const markdown = '![](image.jpg)';

        expect(isBangBraceParam(markdown)).toBe(false);
      });

      test('should return false - valid image, alternative format', () => {
        const markdown = '[baz]: /url1';
        const parentNode = parseMarkdownString(markdown);
        const imageNodes = getImageNodes(parentNode);

        imageNodes.forEach((node) => {
          expect(isCommonmarkImage(node)).toBe(true);
        });

        expect(isBangBraceParam(markdown)).toBe(false);
      });
    });
  });

  describe('2.1 Meta Text', () => {
    describe('2.2 Alt Text', () => {
      test('should be defined', () => {
        expect(isAltText).toBeDefined();
      });

      test('should return true - valid meta text', () => {
        const text = 'alt_text$100x200';

        expect(isAltText(text)).toBe(true);
      });

      test('should return false - has whitespace in alt text', () => {
        const text = 'alt text$100x200';

        expect(isAltText(text)).toBe(false);
      });

      test('should return false - has special characters in alt text', () => {
        const text = 'alt-text$100x200';

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
  });
  describe('3.1 ULR', () => {
    describe('3.2 Valid File Extensions', () => {
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
  });
});

describe('parseMarkdownImage', () => {
  test('should be defined', () => {
    expect(parseMarkdownImage).toBeDefined();
  });

  test('should parse ', () => {
    const markdownString = '![alt_text$100x200](image.jpg)';

    expect(parseMarkdownImage(markdownString)).toEqual({
      metaText: {
        altText: 'alt_text',
        height: 100,
        width: 200,
      },
      url: 'image.jpg',
    });
  });

  test('should throw', () => {
    const markdownString = '![](image.jpg)';
    expect(() => parseMarkdownImage(markdownString)).toThrow(
      'Image naming syntax error - could not parse meta text'
    );
  });
});

describe('parseMetaText', () => {
  test('should be defined', () => {
    expect(parseMetaText).toBeDefined();
  });

  test('should parse meta text', () => {
    const metaText = 'alt_text$100x200';

    expect(parseMetaText(metaText)).toEqual({
      altText: 'alt_text',
      height: 100,
      width: 200,
    });
  });

  test('should throw', () => {
    const metaText = 'alt_text$100200';
    expect(() => parseMetaText(metaText)).toThrow(
      'Image naming syntax error - could not parse meta text'
    );
  });
});

describe('isValidImageSyntax', () => {
  test('should be defined', () => {
    expect(isValidImageSyntax).toBeDefined();
  });

  test('should return true - valid image syntax', () => {
    const markdownString = '![alt_text$100x200](image.jpg)';

    expect(isValidImageSyntax(markdownString)).toBe(true);
  });

  test('should throw - bang-brace-param error', () => {
    const markdownString = '![](image.jpg)';

    expect(() => isValidImageSyntax(markdownString)).toThrow(
      'Invalid Image Syntax: bang-brace-param error'
    );
  });

  test('should throw - Invalid Meta Text', () => {
    const markdownString = '![alt text]()';

    expect(() => isValidImageSyntax(markdownString)).toThrow(
      'Invalid Image Syntax: Invalid Meta Text'
    );
  });

  test('should throw - Invalid File Extension', () => {
    const markdownString = '![alt_text$200x300](image.webp)';

    expect(() => isValidImageSyntax(markdownString)).toThrow(
      'Invalid Image Syntax: Invalid File Extension'
    );
  });
});

const parseMarkdownString = (markdown: string): Node => {
  const parser = new Parser();
  return parser.parse(markdown);
};

const getImageNodes = (node: Node): Node[] => {
  const imageNodes: Node[] = [];

  const walker = node.walker();
  let event;
  while ((event = walker.next())) {
    const { node } = event;
    if (node.type === 'image') {
      imageNodes.push(node);
    }
  }

  return imageNodes;
};

const getNodesArr = (node: Node): Node[] => {
  const nodes: Node[] = [];

  const walker = node.walker();
  let event;
  while ((event = walker.next())) {
    const { node } = event;
    nodes.push(node);
  }

  return nodes;
};
