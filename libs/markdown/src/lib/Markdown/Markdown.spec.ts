import { Markdown } from './Markdown';
import { Doc as Document } from '../Doc';
import mock from 'mock-fs';
import fs from 'fs';

import console from 'console';

const mockLogger = jest.mock('console', () => ({
  log: jest.fn(),
}));

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

  describe('update', () => {
    let sut: Markdown;

    const mockFileSystem = {
      'path/to/file.md': 'update me',
    };

    beforeEach(() => {
      mock(mockFileSystem);
      sut = new Markdown('path/to/file.md');
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
      const value = fs.readFileSync('path/to/file.md');

      expect(value).toEqual(expectedValue);
    });

    test('should throw an error if there are no matches', async () => {
      const matcher = new RegExp('no match');
      const replacement = 'updated';

      await expect(sut.update({ matcher, replacement })).rejects.toThrow(
        'Error updating path/to/file.md. No matches found using matched: /no match/'
      );
    });
  });

  describe('report', () => {
    const mockFileSystem = {
      'path/to/file.md': 'report me',
    };

    beforeEach(() => {
      mock(mockFileSystem);
    });

    afterEach(() => {
      mock.restore();
    });

    test('should be defined', () => {
      const sut = new Markdown('path/to/file.md');
      expect(sut.report).toBeDefined();
    });

    test('should log original value if no updates were made', () => {
      const sut = new Markdown('path/to/file.md');
      const loggerSpy = jest.spyOn(sut.logger, 'log');

      sut.report();

      expect(loggerSpy).toHaveBeenCalledWith('report me');
    });

    test('should log updated value if updates were made', async () => {
      const sut = new Markdown('path/to/file.md');
      const loggerSpy = jest.spyOn(sut.logger, 'log');

      const matcher = new RegExp('report me');
      const replacement = 'reported';

      await sut.update({ matcher, replacement });
      sut.report();

      expect(loggerSpy).toHaveBeenCalledWith('reported');
    });
  });
});
