import mock from 'mock-fs';
import { MarkdownCrawler, MarkdownCrawlerConfig } from './MarkdownCrawler';
import {
  MD_BASE_PATH,
  MockMarkdownFileList,
  MockMarkdownFileSystem,
} from './MarkdownMocks';

describe('MarkdownCrawler', () => {
  test('should be defined', () => {
    expect(MarkdownCrawler).toBeDefined();
  });

  const config: MarkdownCrawlerConfig = {
    targetDir: MD_BASE_PATH,
  };

  let sut: MarkdownCrawler;

  beforeEach(() => {
    mock(MockMarkdownFileSystem);
    sut = new MarkdownCrawler(config);
  });

  afterEach(() => {
    mock.restore();
  });

  afterAll(() => {
    mock.restore();
  });

  const expected = MockMarkdownFileList;

  test('should return the correct docs', () => {
    const docs = sut.docs;

    expect(docs.every((doc) => expected.includes(doc))).toBeTruthy();
  });

  test('should return the correct docs - nested file system', () => {
    const nestedMock = {
      ...MockMarkdownFileSystem,
      [`${MD_BASE_PATH}nested/`]: {
        'nested-file.md': 'nested file content',
      },
    };

    mock(nestedMock);
    sut = new MarkdownCrawler(config);

    const nestedExpected = [...expected, 'nested-file.md'];
    const docs = sut.docs;

    expect(docs.every((doc) => nestedExpected.includes(doc))).toBeTruthy();
  });
});
