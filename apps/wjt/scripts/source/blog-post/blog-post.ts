import { Node } from 'commonmark';

import {
  parseRawPost,
  renderPost,
  getImageNodes,
  generatePostImage,
  listBucketContent,
} from './blog-post.utils';

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

export type PostImage = {
  originalSrc: string;
  altText: string;
  imageNode: Node;
  caption?: string;
  cdnEndpoint?: string;
};

export interface IBlogPost {
  rawPost: RawPost;
  parsedPost: Post;
  postMarkup: string;
  postImages?: PostImage[];
  listBucketContents(): Promise<void>;
}

export class BlogPost implements IBlogPost {
  parsedPost: Post;
  postMarkup: string;
  postImages?: PostImage[] | undefined;

  private _imageNodes?: Node[] | undefined;

  constructor(public rawPost: RawPost) {
    this.parsedPost = parseRawPost(rawPost);
    this.postMarkup = renderPost(this.parsedPost);
    this._imageNodes = getImageNodes(this.parsedPost.content);
    this.initPostImages();
  }

  private initPostImages(): void {
    this.postImages = this._imageNodes?.map((node: Node) => {
      return generatePostImage(node);
    });
  }

  public async listBucketContents(): Promise<void> {
    await listBucketContent();
  }
}
