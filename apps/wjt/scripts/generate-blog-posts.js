"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRawBlogPost = exports.getRawPostFileNames = void 0;
var blog_post_1 = require("./blog-post");
var fs_1 = require("fs");
var path_1 = require("path");
var postsPath = process.env.POSTS_PATH || 'src/posts';
/**
 * Returns the markdown file names in the posts directory
 * @returns {string[]}
 */
var getRawPostFileNames = function () {
    return (0, fs_1.readdirSync)(postsPath).filter(function (file) { return file.endsWith('.md'); });
};
exports.getRawPostFileNames = getRawPostFileNames;
var getRawBlogPost = function (rawPostFileName) {
    var rawPostPath = (0, path_1.join)(postsPath, rawPostFileName);
    return (0, fs_1.readFileSync)(rawPostPath, 'utf8');
};
exports.getRawBlogPost = getRawBlogPost;
var init = function () {
    console.log('Generating blog posts 📝...\n\n');
    var rawPostFileNames = (0, exports.getRawPostFileNames)();
    rawPostFileNames.forEach(function (rawPostFileName) {
        var rawPost = (0, exports.getRawBlogPost)(rawPostFileName);
        var blogPost = new blog_post_1.BlogPost(rawPost);
        var targetPath = (0, path_1.join)(postsPath, blogPost.parsedPost.frontMatter.slug + '.html');
        console.log("Writing blog post markup to ".concat(targetPath, "...\n"));
        (0, fs_1.writeFileSync)(targetPath, blogPost.postMarkup);
    });
};
init();
