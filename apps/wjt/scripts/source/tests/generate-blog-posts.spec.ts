import { getRawPostFileNames, getRawBlogPost } from '../generate-blog-posts';
import MockFs from 'mock-fs';
import { rawPostMocks } from '../blog-post';

const postsMockFsEntry = {
  'src/posts': {
    'post-1.md': rawPostMocks[0],
    'post-2.md': rawPostMocks[1],
    'post-3.md': rawPostMocks[2],
  },
};

const targetPaths = Object.keys(postsMockFsEntry['src/posts']);

describe('generate-blog-posts', () => {
  describe('getRawPostFileNames', () => {
    beforeEach(() => {
      MockFs(postsMockFsEntry);
    });

    afterEach(() => {
      MockFs.restore();
    });

    test('should be defined', () => {
      expect(getRawPostFileNames).toBeDefined();
    });

    test('should return an array of raw post paths', () => {
      const rawPostPaths = getRawPostFileNames();

      expect(rawPostPaths).toEqual(targetPaths);
    });

    test('should not return any non-markdown files', () => {
      MockFs({
        'src/posts': {
          ...postsMockFsEntry['src/posts'],
          'post-1.html': '',
        },
      });

      const rawPostPaths = getRawPostFileNames();
      expect(rawPostPaths).toEqual(targetPaths);
    });
  });

  describe('getRawBlogPost', () => {
    beforeEach(() => {
      MockFs(postsMockFsEntry);
    });

    afterEach(() => {
      MockFs.restore();
    });

    test('should be defined', () => {
      expect(getRawBlogPost).toBeDefined();
    });

    test('should return the raw content of a post', () => {
      const rawPostPath = getRawPostFileNames()[0];
      const rawPost = getRawBlogPost(rawPostPath);

      expect(rawPost).toEqual(rawPostMocks[0]);
    });
  });
});
