import { Node } from 'commonmark';
import {
  parseRawPost,
  renderPost,
  getImageNodes,
  generatePostImage,
  updateImageSources,
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

export type ImageUpdateMap = {
  originalSrc: string;
  newSrc: string;
};

export interface IBlogPost {
  rawPost: RawPost;
  parsedPost: Post;
  postMarkup: string;
  postImages?: PostImage[];

  updateImageSources(imageUpdateMap: ImageUpdateMap[]): void;
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

  public updateImageSources(imageUpdateMap: ImageUpdateMap[]): void {
    const updatedPost = updateImageSources(imageUpdateMap, this.parsedPost);

    this.parsedPost = updatedPost;
    this.postMarkup = renderPost(updatedPost);
  }
}
