import { BlogPost } from './blog-post/blog-post';

import { rawPostMocks } from './blog-post/blog-post.mocks';

const blogPost = new BlogPost(rawPostMocks[0]);

console.log(blogPost.postMarkup);
