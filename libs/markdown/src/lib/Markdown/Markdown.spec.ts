import { Markdown } from './Markdown';
import {
  MockMarkdownFileSystem,
  MockMarkdownFilesPaths,
} from './MarkdownMocks';
import { Doc as Document } from '../Doc';
import mock from 'mock-fs';
import fs from 'fs';
import { Node as CommonmarkNode } from 'commonmark';

describe('Markdown Document', () => {
  test('should be defined', () => {
    expect(Markdown).toBeDefined();
  });

  describe('Document properties', () => {
    let sut: Markdown;

    beforeEach(() => {
      mock(MockMarkdownFileSystem);
      sut = new Markdown(MockMarkdownFilesPaths.FILE);
    });

    afterEach(() => {
      mock.restore();
    });

    test('should extend Document', () => {
      expect(Markdown.prototype).toBeInstanceOf(Document);
    });

    test('should have a path property', () => {
      expect(sut.path).toBe('/path/to/file.md');
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

  describe('update', () => {
    let sut: Markdown;

    beforeEach(() => {
      const mockLogger = jest.fn();
      mock(MockMarkdownFileSystem);
      sut = new Markdown(
        MockMarkdownFilesPaths.UPDATE,
        mockLogger as unknown as typeof console
      );
    });

    afterEach(() => {
      mock.restore();
    });

    test('should be defined', () => {
      expect(sut.update).toBeDefined();
    });

    test('should update the document', async () => {
      const matcher = new RegExp('update me');
      const replacement = 'updated';

      await sut.update({ matcher, replacement });

      const expectedValue = Buffer.from('updated');
      const value = fs.readFileSync(MockMarkdownFilesPaths.UPDATE);

      expect(value).toEqual(expectedValue);
    });

    test('should throw an error if there are no matches', async () => {
      const matcher = new RegExp('no match');
      const replacement = 'updated';

      await expect(sut.update({ matcher, replacement })).rejects.toThrow(
        'Error updating /path/to/update.md. No matches found using matcher: /no match/'
      );
    });
  });

  describe('report', () => {
    beforeEach(() => {
      mock(MockMarkdownFileSystem);
    });

    afterEach(() => {
      mock.restore();
    });

    test('should be defined', () => {
      const sut = new Markdown(MockMarkdownFilesPaths.REPORT);
      expect(sut.report).toBeDefined();
    });

    test('should log original value if no updates were made', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      const sut = new Markdown(MockMarkdownFilesPaths.REPORT);

      sut.report();

      expect(logSpy).toHaveBeenCalledWith('report me');
    });

    test('should log updated value if updates were made', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      const sut = new Markdown(MockMarkdownFilesPaths.REPORT);

      const matcher = new RegExp('report me');
      const replacement = 'reported';

      await sut.update({ matcher, replacement });
      sut.report();

      expect(logSpy).toHaveBeenCalledWith('reported');
    });
  });

  describe('parse', () => {
    let sut: Markdown;

    beforeEach(() => {
      const mockLogger = jest.fn();
      mock(MockMarkdownFileSystem);

      sut = new Markdown(
        MockMarkdownFilesPaths.FILE,
        mockLogger as unknown as typeof console
      );
    });

    afterEach(() => {
      mock.restore();
      jest.restoreAllMocks();
    });

    test('should be defined', () => {
      expect(sut.parse).toBeDefined();
    });

    test('should parse the markdown document into an AST', () => {
      sut.parse();

      expect(sut.AST).toBeDefined();
      expect(sut.AST).toBeInstanceOf(CommonmarkNode);
    });
  });

  describe('toString', () => {
    let sut: Markdown;

    beforeEach(() => {
      const mockLogger = jest.fn();
      mock(MockMarkdownFileSystem);

      sut = new Markdown(
        MockMarkdownFilesPaths.UPDATE,
        mockLogger as unknown as typeof console
      );
    });

    afterEach(() => {
      mock.restore();
      jest.restoreAllMocks();
    });

    test('should be defined', () => {
      expect(sut.toString).toBeDefined();
    });

    test('should return the original value if no updates were made', () => {
      expect(sut.toString()).toBe('update me');
    });

    test('should return the updated value if it exists', async () => {
      const matcher = new RegExp('update me');
      const replacement = 'updated';

      await sut.update({ matcher, replacement });

      expect(sut.toString()).toBe('updated');
    });
  });

  describe('getNodesByType', () => {
    let sut: Markdown;

    const markdownFile = `# Heading 1 \n\n![alt text](image.jpg)`;

    beforeEach(() => {
      mock(MockMarkdownFileSystem);
      sut = new Markdown(MockMarkdownFilesPaths.IMAGE_DOC);
    });

    afterEach(() => {
      mock.restore();
    });

    test('should be defined', () => {
      expect(sut.getNodesByType).toBeDefined();
    });

    test('should return the correct nodes', () => {
      let targetNodes = sut.getNodesByType('image');

      expect(targetNodes).toHaveLength(1);
      expect(targetNodes[0].type).toBe('image');

      targetNodes = sut.getNodesByType('heading');
      expect(targetNodes).toHaveLength(1);
      expect(targetNodes[0].type).toBe('heading');
    });
  });
});
