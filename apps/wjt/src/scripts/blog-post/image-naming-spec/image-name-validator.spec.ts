import { ImageNameValidator } from './image-name-validator';

describe('ImageNameValidator', () => {
  test('should be defined', () => {
    expect(ImageNameValidator).toBeDefined();
  });

  let sut: ImageNameValidator;

  beforeEach(() => {
    sut = new ImageNameValidator(
      '![alt-text$200x200](image.jpg)',
      'some-markdown-doc.md'
    );
  });

  describe('getImageNodes', () => {
    test('should be defined', () => {
      expect(sut.getImageNodes).toBeDefined();
    });

    test('should return an array of image nodes', () => {
      const imageNodes = sut.getImageNodes();

      expect(imageNodes).toHaveLength(1);
    });

    test('should return an array of image nodes', () => {
      sut = new ImageNameValidator(
        '![alt_text200x200](image.jpg) ![alt_text200x200](image.jpg)',
        'some-markdown-doc.md'
      );

      const imageNodes = sut.getImageNodes();

      expect(imageNodes).toHaveLength(2);
    });
  });

  describe('sut.parsedCommonmarkData', () => {
    test('should be defined', () => {
      expect(sut.parsedCommonmarkData).toBeDefined();
    });

    test('should return an array of parsed image data', () => {
      const parsedCommonmarkData = sut.parsedCommonmarkData;

      expect(parsedCommonmarkData).toHaveLength(1);
      expect(parsedCommonmarkData[0]).toEqual({
        alt: 'alt-text$200x200',
        src: 'image.jpg',
      });
    });
  });

  describe('validateAltTexts', () => {
    test('should not produce any alt text validation errors', () => {
      expect(sut.errors).toHaveLength(0);
    });

    test('should produce an alt text validation error', () => {
      sut = new ImageNameValidator(
        '![alt-text](image.jpg)',
        'some-markdown-doc.md'
      );

      expect(sut.errors).toHaveLength(1);
      expect(sut.errors[0]).toEqual({
        documentPath: 'some-markdown-doc.md',
        imageData: {
          alt: 'alt-text',
          src: 'image.jpg',
        },
        message: 'Invalid alt text',
      });
    });
  });

  describe('validateImageSources', () => {
    test('should not produce any image source validation errors', () => {
      expect(sut.errors).toHaveLength(0);
    });

    test('should produce an image source validation error', () => {
      sut = new ImageNameValidator(
        '![alt-text$200x200](image.gif)',
        'some-markdown-doc.md'
      );

      expect(sut.errors).toHaveLength(1);
      expect(sut.errors[0]).toEqual({
        documentPath: 'some-markdown-doc.md',
        imageData: {
          alt: 'alt-text$200x200',
          src: 'image.gif',
        },
        message: 'Invalid file extension. Must be .jpg, .jpeg, .png, or .svg',
      });
    });
  });
});
