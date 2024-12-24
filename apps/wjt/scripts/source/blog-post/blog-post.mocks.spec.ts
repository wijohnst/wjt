import { getMockPostContent, mockValues } from './blog-post.mocks';

describe('getMockPostContent', () => {
  test('should be defined', () => {
    expect(getMockPostContent).toBeDefined();
  });

  test('return value should match snapshots', () => {
    expect(getMockPostContent(mockValues[0])).toMatchSnapshot();
  });
});
