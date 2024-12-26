"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawContentMocks = exports.rawFrontmatterMocks = exports.rawPostMocks = exports.getMockFrontmatter = exports.getMockPostContent = exports.rawPosts = void 0;
exports.rawPosts = [
    [
        '---',
        'title: Post 1',
        'author: Some Author',
        'slug: post-1',
        '---',
        '# Post 1\n',
        'This is the first post.',
        '![Image 1](/path/to/image-1.jpg)',
    ],
    [
        '---',
        'title: Post 2',
        'author: Another Author',
        'slug: post-2',
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
const getMockPostContent = (mockValues) => {
    return mockValues.join('\n');
};
exports.getMockPostContent = getMockPostContent;
const getMockFrontmatter = (title, author, slug) => ({
    title,
    author,
    slug,
});
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
