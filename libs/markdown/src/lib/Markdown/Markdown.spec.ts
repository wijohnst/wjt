import { Markdown } from './Markdown';
import { Doc as Document } from '../Doc';
import mock from 'mock-fs';

describe('Markdown Document', () => {
  test('should be defined', () => {
    expect(Markdown).toBeDefined();
  });

  describe('Document properties', () => {
    let sut: Markdown;

    const mockFileSystem = {
      'path/to/file.md': 'file content',
    };

    beforeEach(() => {
      mock(mockFileSystem);
      sut = new Markdown('path/to/file.md');
    });

    afterEach(() => {
      mock.restore();
    });

    test('should extend Document', () => {
      expect(Markdown.prototype).toBeInstanceOf(Document);
    });

    test('should have a path property', () => {
      expect(sut.path).toBe('path/to/file.md');
    });

    test('should have a fileExtension property', () => {
      expect(sut.fileExtension).toBe('.md');
    });

    test('should have a name property', () => {
      expect(sut.name).toBe('file');
    });

    test('should have a value property', () => {
      const expectedValue = Buffer.from('file content');

      expect(sut.value).toEqual(expectedValue);
    });
  });
});
