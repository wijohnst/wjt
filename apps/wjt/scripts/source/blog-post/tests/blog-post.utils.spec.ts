import MockFs from 'mock-fs';
import {
  defaultFrontMatter,
  parseRawPost,
  getFrontmatter,
  renderPost,
  getRawBlogPost,
  getRawPostFileNames,
} from '../blog-post.utils';

import {
  getMockFrontmatter,
  rawPostMocks,
  rawContentMocks,
} from '../blog-post.mocks';

describe('blog-post.utils', () => {
  test('should be defined', () => {
    expect(defaultFrontMatter).toBeDefined();
  });

  describe('parseRawPost - util', () => {
    test('should be defined', () => expect(parseRawPost).toBeDefined());

    test('should return the correct post object', () => {
      const post = parseRawPost(rawPostMocks[0]);
      const frontMatter = getMockFrontmatter('Post 1', 'Some Author', 'post-1');
      const content = rawContentMocks[0];

      expect(post).toEqual({
        frontMatter,
        content,
      });
    });
  });

  describe('getFrontmatter', () => {
    test('should be defined', () => {
      expect(getFrontmatter).toBeDefined();
    });

    test('should throw when frontmatter is missing', () => {
      expect(() => getFrontmatter('')).toThrow();
    });

    test('should return the frontmatter of a post', () => {
      const frontmatter = getFrontmatter(rawPostMocks[0]);
      const expectedFrontmatter = getMockFrontmatter(
        'Post 1',
        'Some Author',
        'post-1'
      );

      expect(frontmatter).toEqual(expectedFrontmatter);
    });

    test('frontmatter should not include `---` delimiters', () => {
      const frontmatter = getFrontmatter(rawPostMocks[0]);

      expect(frontmatter).not.toContain('---');
    });

    test('should throw when default frontmatter is incomplete', () => {
      const incompleteFrontmatter = rawPostMocks[2];

      expect(() => getFrontmatter(incompleteFrontmatter)).toThrow();
    });
  });

  describe('renderPost', () => {
    test('should be defined', () => {
      expect(renderPost).toBeDefined();
    });

    test('should return the rendered post', () => {
      const renderedPost = renderPost({
        frontMatter: getMockFrontmatter('Post 1', 'Some Author', 'post-1'),
        content: rawContentMocks[0],
      });

      expect(renderedPost).toMatchSnapshot();
    });
  });
});

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
