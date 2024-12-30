import mock from 'mock-fs';
import { updateMarkdown, generateFrontmatterString } from './markdown.utils';

import { rawPostMocks, rawFrontmatterMocks, BlogPost } from '../blog-post';
import { readFileSync } from 'fs';

describe('markdown utils', () => {
  describe('updateMarkdown', () => {
    beforeEach(() => {
      mock({
        'src/posts/test.md': rawPostMocks[0],
        'src/views/templates/head.pug': readFileSync(
          'src/views/templates/head.pug',
          'utf-8'
        ),
      });
    });

    test('should be defined', () => {
      expect(updateMarkdown).toBeDefined();
    });

    test('should update image sources', () => {
      const blogPost = new BlogPost(rawPostMocks[0]);
      const result = updateMarkdown('test.md', blogPost.parsedPost, [
        {
          originalSrc: './path/to/image-1.jpg',
          newSrc: 'https://example.com/path/to/image-1.jpg',
        },
      ]) as string;

      const updatedBlogPost = new BlogPost(result);
      expect(updatedBlogPost.postImages[0].imageNode.destination).toBe(
        'https://example.com/path/to/image-1.jpg'
      );
    });
  });

  describe('generateFrontmatterString', () => {
    test('should be defined', () => {
      expect(generateFrontmatterString).toBeDefined();
    });

    test('should return a stringified frontmatter object', () => {
      const blogPost = new BlogPost(rawPostMocks[0]);
      const result = generateFrontmatterString(blogPost.parsedPost.frontMatter);

      expect(result).toBe(rawFrontmatterMocks[0]);
    });
  });
});
