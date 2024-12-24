import { renderFile } from 'pug';
import { Parser, HtmlRenderer } from 'commonmark';
import { cwd } from 'process';
import { join } from 'path';
import { readFileSync } from 'fs';

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
  parsedPost: Post | null;
  postMarkup: string | null;
}

export class BlogPost implements IBlogPost {
  parsedPost: Post | null = null;
  postMarkup: string | null = null;

  constructor(public rawPost: RawPost) {
    this.parsedPost = parseRawPost(rawPost);
    this.postMarkup = renderPost(this.parsedPost);
  }
}
