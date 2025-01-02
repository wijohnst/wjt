import { DefaultFrontMatter } from './blog-post';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

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
    '![Image 1](./path/to/image-1.jpg)',
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
    '![CDN Image](https://wjt.sfo2.cdn.digitaloceanspaces.com/wjt_logo.ico)',
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
  slug: string,
  description: string
): DefaultFrontMatter => ({
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
  'src/views/templates/head.pug': readFileSync(
    join(cwd(), 'src/views/templates/head.pug'),
    'utf8'
  ),
};
