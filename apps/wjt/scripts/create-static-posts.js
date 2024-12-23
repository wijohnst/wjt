"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var static_posts_1 = require("./static-posts");
var path_1 = require("path");
var fs_1 = require("fs");
var init = function () {
    var fileNames = (0, static_posts_1.getMarkdownFiles)();
    (0, static_posts_1.parseRawPosts)().forEach(function (post, index) {
        var fileName = fileNames[index];
        var filePath = (0, path_1.join)('apps/wjt', static_posts_1.postsPath, fileName);
        var renderedPost = (0, static_posts_1.getRenderedPost)(post);
        (0, fs_1.writeFileSync)(filePath.replace('.md', '.html'), renderedPost);
    });
};
init();
