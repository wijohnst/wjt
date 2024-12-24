"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blog_post_1 = require("./blog-post/blog-post");
var blog_post_mocks_1 = require("./blog-post/blog-post.mocks");
var blogPost = new blog_post_1.BlogPost(blog_post_mocks_1.rawPostMocks[0]);
console.log(blogPost.postMarkup);
