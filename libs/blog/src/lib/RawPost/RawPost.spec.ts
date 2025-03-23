import { RawPost } from './RawPost';
import { MockRawPostFileSystem, RawPostPaths } from './RawPostMocks';

import mock from 'mock-fs';

describe('RawPost', () => {
  let sut: RawPost;

  beforeEach(() => {
    mock(MockRawPostFileSystem);
    sut = new RawPost(RawPostPaths.LOCAL);
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

  test('should be defined', () => {
    expect(RawPost).toBeDefined();
  });

  describe('imageNodes', () => {
    test('should be defined', () => {
      expect(sut.imageNodes).toBeDefined();
    });

    test('should have image nodes', () => {
      expect(sut.imageNodes).toHaveLength(1);
    });
  });

  describe('originalContent', () => {
    test('should be defined', () => {
      expect(sut.originalContent).toBeDefined();
    });

    test('should have the correct original content', () => {
      const expectedContent = MockRawPostFileSystem[RawPostPaths.LOCAL];

      expect(sut.originalContent).toEqual(expectedContent);
    });
  });

  describe('rawFrontMatter', () => {
    test('should be defined', () => {
      expect(sut.rawFrontMatter).toBeDefined();
    });

    test('should return the correct raw frontmatter string', () => {
      const expectedFrontMatter = `---\ntitle: My Example Post\nauthor: Will Johnston\nslug: example-post\n---`;

      expect(sut.rawFrontMatter).toEqual(expectedFrontMatter);
    });
  });
});
