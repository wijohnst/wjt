'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var blog_post_1 = require('./blog-post');
var fs_1 = require('fs');
var path_1 = require('path');
var init = function () {
  console.log('Generating blog posts 📝...\n\n');
  var rawPostFileNames = (0, blog_post_1.getRawPostFileNames)();
  rawPostFileNames.forEach(function (rawPostFileName) {
    var rawPost = (0, blog_post_1.getRawBlogPost)(rawPostFileName);
    var blogPost = new blog_post_1.BlogPost(rawPost);
    var targetPath = (0, path_1.join)(
      blog_post_1.postsPath,
      blogPost.parsedPost.frontMatter.slug + '.html'
    );
    console.log('Writing blog post markup to '.concat(targetPath, '...\n'));
    (0, fs_1.writeFileSync)(targetPath, blogPost.postMarkup);
  });
};
init();
