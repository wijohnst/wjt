import {
  defaultFrontMatter,
  parseRawPost,
  getFrontmatter,
  renderPost,
} from './blog-post.utils';

import { mockPostContent } from './blog-post.mocks';

describe('blog-post.utils', () => {
  test('should be defined', () => {
    expect(defaultFrontMatter).toBeDefined();
  });

  describe('parseRawPost - util', () => {
    test('should be defined', () => expect(parseRawPost).toBeDefined());

    test('should return the correct post object', () => {
      const post = parseRawPost(mockPostContent[0]);

      expect(post).toEqual({
        frontMatter: {
          title: 'Post 1',
          author: 'Some Author',
          slug: 'post-1',
        },
        content: `# Post 1\n\nThis is the first post.`,
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
      const frontmatter = getFrontmatter(mockPostContent[0]);
      expect(frontmatter).toEqual({
        title: 'Post 1',
        author: 'Some Author',
        slug: 'post-1',
      });
    });

    test('frontmatter should not include `---` delimiters', () => {
      const frontmatter = getFrontmatter(mockPostContent[0]);
      expect(frontmatter).not.toContain('---');
    });

    test('should throw when default frontmatter is incomplete', () => {
      const incompleteFrontmatter = mockPostContent[2];

      expect(() => getFrontmatter(incompleteFrontmatter)).toThrow();
    });
  });

  describe('renderPost', () => {
    test('should be defined', () => {
      expect(renderPost).toBeDefined();
    });

    test('should return the rendered post', () => {
      const renderedPost = renderPost({
        frontMatter: {
          title: 'Post 1',
          author: 'Some Author',
          slug: 'post-1',
        },
        content: '# Post 1\n\nThis is the first post.',
      });

      expect(renderedPost).toMatchSnapshot();
    });
  });
});
