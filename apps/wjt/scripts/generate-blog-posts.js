"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blog_post_1 = require("./blog-post");
const fs_1 = require("fs");
const path_1 = require("path");
const init = async () => {
    console.log('Generating blog posts 📝...\n\n');
    let bucketContents = [];
    const rawPostFileNames = (0, blog_post_1.getRawPostFileNames)();
    rawPostFileNames.forEach(async (rawPostFileName) => {
        const rawPost = (0, blog_post_1.getRawBlogPost)(rawPostFileName);
        const blogPost = new blog_post_1.BlogPost(rawPost);
        await blogPost.listBucketContents();
        const targetPath = (0, path_1.join)(blog_post_1.postsPath, blogPost.parsedPost.frontMatter.slug + '.html');
        console.log(`Writing blog post markup to ${targetPath}...\n`);
        (0, fs_1.writeFileSync)(targetPath, blogPost.postMarkup);
    });
};
init();
