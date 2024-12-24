import {
  defaultFrontMatter,
  parseRawPost,
  getFrontmatter,
  renderPost,
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
