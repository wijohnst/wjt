import {
  getRawPosts,
  parseRawPosts,
  getFrontmatter,
  getRenderedPost,
} from '../source/static-posts';

import { mockPostContent } from './static-posts.mocks';

import mockFs from 'mock-fs';
import { readFileSync } from 'fs';

describe('Static Posts', () => {
  beforeEach(() => {
    mockFs({
      'src/posts': {
        'post1.md': mockPostContent[0],
        'post1.html': `<div>Post 1</div>`,
        'post2.md': mockPostContent[1],
        'post2.html': `<div>Post 2</div>`,
      },
      'src/views/templates': {
        'head.pug': readFileSync('src/views/templates/head.pug', 'utf-8'),
      },
      'src/views/styles': {
        'min.css': readFileSync('src/views/styles/min.css', 'utf-8'),
      },
    });
  });

  describe('getRawPosts', () => {
    test('should be defined', () => {
      expect(getRawPosts).toBeDefined();
    });

    test('should return an array of posts', () => {
      const posts = getRawPosts();
      expect(posts).toHaveLength(2);
    });
  });

  describe('parseRawPosts', () => {
    test('should be defined', () => {
      expect(parseRawPosts).toBeDefined();
    });

    test('should return an array of parsed posts', () => {
      const parsedPosts = parseRawPosts();

      expect(parsedPosts[0].frontMatter).toEqual({
        title: 'Post 1',
        author: 'Some Author',
        slug: 'post-1',
      });

      const contentHunks = parsedPosts[0].content.split('\n');
      expect(contentHunks[0].trim()).toEqual('# Post 1');
      expect(contentHunks[1].trim()).toEqual('');
      expect(contentHunks[2].trim()).toEqual('This is the first post.');
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

  describe('getRenderedPost', () => {
    test('should be defined', () => {
      expect(getRenderedPost).toBeDefined();
    });

    test('should return the rendered post', () => {
      mockFs.restore();

      const renderedPost = getRenderedPost({
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
