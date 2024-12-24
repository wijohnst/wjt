import { BlogPost } from './blog-post';

import { mockPostContent } from './blog-post.mocks';

describe('blog-post', () => {
  describe('BlogPost', () => {
    test('should be defined', () => {
      expect(BlogPost).toBeDefined();
    });
  });

  describe('parsePost - util', () => {
    let sut: BlogPost;

    beforeEach(() => {
      sut = new BlogPost(mockPostContent[0]);
    });

    test('should return a parsed post object', () => {
      expect(sut.parsedPost).toStrictEqual({
        frontMatter: {
          title: 'Post 1',
          author: 'Some Author',
          slug: 'post-1',
        },
        content: `# Post 1\n\nThis is the first post.`,
      });
    });

    test('should return the rendered post', () => {
      expect(sut.postMarkup).toMatchSnapshot();
    });
  });
});
