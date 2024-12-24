'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.rawContentMocks =
  exports.rawFrontmatterMocks =
  exports.rawPostMocks =
  exports.getMockFrontmatter =
  exports.getMockPostContent =
  exports.rawPosts =
    void 0;
exports.rawPosts = [
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
var getMockPostContent = function (mockValues) {
  return mockValues.join('\n');
};
exports.getMockPostContent = getMockPostContent;
var getMockFrontmatter = function (title, author, slug) {
  return {
    title: title,
    author: author,
    slug: slug,
  };
};
exports.getMockFrontmatter = getMockFrontmatter;
exports.rawPostMocks = [
  (0, exports.getMockPostContent)(exports.rawPosts[0]),
  (0, exports.getMockPostContent)(exports.rawPosts[1]),
  (0, exports.getMockPostContent)(exports.rawPosts[2]),
];
exports.rawFrontmatterMocks = [
  (0, exports.getMockPostContent)(exports.rawPosts[0].slice(0, 5)),
  (0, exports.getMockPostContent)(exports.rawPosts[1].slice(0, 5)),
  (0, exports.getMockPostContent)(exports.rawPosts[2].slice(0, 4)),
];
exports.rawContentMocks = [
  (0, exports.getMockPostContent)(exports.rawPosts[0].slice(5)),
  (0, exports.getMockPostContent)(exports.rawPosts[1].slice(5)),
  (0, exports.getMockPostContent)(exports.rawPosts[2].slice(4)),
];
