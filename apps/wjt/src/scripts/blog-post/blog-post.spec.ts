import { BlogPost, getImageNodes } from '../blog-post';
import {
  rawPostMocks,
  rawContentMocks,
  getMockFrontmatter,
} from './blog-post.mocks';

describe('blog-post', () => {
  describe('BlogPost', () => {
    test('should be defined', () => {
      expect(BlogPost).toBeDefined();
    });
  });

  let sut: BlogPost;

  beforeEach(() => {
    sut = new BlogPost(rawPostMocks[0]);
  });

  test('should return a parsed post object', () => {
    const frontMatter = getMockFrontmatter(
      'Post 1',
      'Some Author',
      'post-1',
      'This is a sample mock post used for testing.'
    );
    const content = rawContentMocks[0];

    expect(sut.parsedPost).toStrictEqual({
      frontMatter,
      content,
    });
  });

  test('should return the rendered post', () => {
    expect(sut.postMarkup).toMatchSnapshot();
  });

  test('should return an array of post images', () => {
    expect(sut.postImages).toHaveLength(1);
    expect(sut.postImages).toMatchSnapshot();
  });

  describe('blogImages', () => {
    test('should be defined', () => {
      expect(sut.blogImages).toBeDefined();
    });

    test('should return an array of blog images', () => {
      expect(sut.blogImages).toHaveLength(1);
      expect(sut.blogImages).toMatchSnapshot();
    });
  });

  test('should update image sources', () => {
    sut.updateImageSources([
      {
        originalSrc: './path/to/image-1.jpg',
        newSrc: 'https://example.com/path/to/image-1.jpg',
      },
    ]);

    const imageNodes = getImageNodes(sut.parsedPost.content);

    expect(imageNodes[0].destination).toBe(
      'https://example.com/path/to/image-1.jpg'
    );
    expect(sut.postMarkup).toMatchSnapshot();
  });
});
