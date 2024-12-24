import { DefaultFrontMatter } from './blog-post';

export const rawPosts = [
  [
    '---',
    'title: Post 1',
    'author: Some Author',
    'slug: post-1',
    '---',
    '# Post 1\n',
    'This is the first post.',
  ],
  [
    '---',
    'title: Post 2',
    'author: Another Author',
    'slug: post-2',
    '---',
    '# Post 2\n',
    'This is the second post.',
  ],
  [
    '---',
    'title: Post 3',
    'author: Yet Another Author',
    '---',
    '# Post 3\n',
    'This is the third post.',
  ],
];

export const getMockPostContent = (mockValues: string[]): string => {
  return mockValues.join('\n');
};

export const getMockFrontmatter = (
  title: string,
  author: string,
  slug: string
): DefaultFrontMatter => ({
  title,
  author,
  slug,
});

export const rawPostMocks = [
  getMockPostContent(rawPosts[0]),
  getMockPostContent(rawPosts[1]),
  getMockPostContent(rawPosts[2]),
];

export const rawFrontmatterMocks = [
  getMockPostContent(rawPosts[0].slice(0, 5)),
  getMockPostContent(rawPosts[1].slice(0, 5)),
  getMockPostContent(rawPosts[2].slice(0, 4)),
];

export const rawContentMocks = [
  getMockPostContent(rawPosts[0].slice(5)),
  getMockPostContent(rawPosts[1].slice(5)),
  getMockPostContent(rawPosts[2].slice(4)),
];
