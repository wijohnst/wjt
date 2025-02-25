import { RequiredFrontMatter } from './blog-post';

export const rawPosts = [
  [
    '---',
    'title: Post 1',
    'author: Some Author',
    'slug: post-1',
    'description: This is a sample mock post used for testing.',
    '---',
    '# Post 1\n',
    'This is the first post.',
    '![image$100x200](./path/to/image-1.jpg)',
  ],
  [
    '---',
    'title: Post 2',
    'author: Another Author',
    'slug: post-2',
    'description: This is another sample mock post used for testing.',
    '---',
    '# Post 2\n',
    'This is the second post.',
    '![cdn-image$200x200](https://wjt.sfo2.cdn.digitaloceanspaces.com/image-2.jpg)',
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

export const mockHeadTemplate = `
head 
    title #{title || 'willjohnston.tech'} 
    meta(name="viewport" content="width=device-width, initial-scale=1")
    meta(name="description" content=description ? description : 'willjohnston.tech')
    link(rel='icon' href='https://wjt.sfo2.cdn.digitaloceanspaces.com/wjt_logo.ico')
    link(rel='stylesheet' href='min.css')
`;

export const getMockPostContent = (mockValues: string[]): string => {
  return mockValues.join('\n');
};

export const getMockFrontmatter = (
  title: string,
  author: string,
  slug: string,
  description: string
): RequiredFrontMatter => ({
  title,
  author,
  slug,
  description,
});

export const rawPostMocks = [
  getMockPostContent(rawPosts[0]),
  getMockPostContent(rawPosts[1]),
  getMockPostContent(rawPosts[2]),
];

export const rawFrontmatterMocks = [
  getMockPostContent(rawPosts[0].slice(0, 6)),
  getMockPostContent(rawPosts[1].slice(0, 6)),
  getMockPostContent(rawPosts[2].slice(0, 5)),
];

export const rawContentMocks = [
  getMockPostContent(rawPosts[0].slice(6)),
  getMockPostContent(rawPosts[1].slice(6)),
  getMockPostContent(rawPosts[2].slice(5)),
];

export const mockFileSystem = {
  'src/posts/example-post.md': rawPostMocks[0],
  'src/posts/example-post-2.md': rawPostMocks[1],
  'src/posts/example-post-3.md': rawPostMocks[2],
  'src/views/templates/head.pug': mockHeadTemplate,
};
