import { parseRawPost, renderPost } from './blog-post.utils';

export type DefaultFrontMatter = {
  title: string;
  author: string;
  slug: string;
};

export type RawPost = string;

export type Post = {
  frontMatter: DefaultFrontMatter;
  content: string;
};

export interface IBlogPost {
  rawPost: RawPost;
  parsedPost: Post;
  postMarkup: string;
}

export class BlogPost implements IBlogPost {
  parsedPost: Post;
  postMarkup: string;

  constructor(public rawPost: RawPost) {
    this.parsedPost = parseRawPost(rawPost);
    this.postMarkup = renderPost(this.parsedPost);
  }
}
