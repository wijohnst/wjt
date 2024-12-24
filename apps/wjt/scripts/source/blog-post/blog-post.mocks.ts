// export const mockPostContent = [
//   '---\ntitle: Post 1\nauthor: Some Author\nslug: post-1\n---\n# Post 1\n\nThis is the first post.\n',
//   '---\ntitle: Post 2\n\nauthor: Another Author\nslug: post-2\n---\n# Post 2\n\nThis is the second post.\n',
//   '---\ntitle: Post 3\n\nauthor: Yet Another Author\n---\n# Post 3\nThis is the third post.\n',
// ];

export const mockValues = [
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

export const mockPostContent = [
  getMockPostContent(mockValues[0]),
  getMockPostContent(mockValues[1]),
  getMockPostContent(mockValues[2]),
];
