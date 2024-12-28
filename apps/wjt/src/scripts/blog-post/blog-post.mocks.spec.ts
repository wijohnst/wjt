import { getMockPostContent, rawPosts } from './blog-post.mocks';

describe('getMockPostContent', () => {
  test('should be defined', () => {
    expect(getMockPostContent).toBeDefined();
  });

  test('return value should match snapshots', () => {
    rawPosts.forEach((rawPost) => {
      expect(getMockPostContent(rawPost)).toMatchSnapshot();
    });
  });
});
