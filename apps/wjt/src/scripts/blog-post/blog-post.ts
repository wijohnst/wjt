import { Node } from 'commonmark';
import {
  parseRawMarkdownPost,
  renderPost,
  getImageNodes,
  generatePostImage,
  _updateImageSources,
} from './blog-post.utils';
import { BlogImage } from '../blog-image/blog-image';

/**
 * Represents the required front matter for a blog post
 */
export type RequiredFrontMatter = {
  title: string;
  author: string;
  slug: string;
  description: string;
};

/**
 * A string representation of a raw markdown document
 */
export type RawMarkdownPost = string;

/**
 * A parsed markdown document
 */
export type Post = {
  frontMatter: RequiredFrontMatter;
  content: string;
};

/**
 * Represents an image in a blog post
 */
export type PostImage = {
  originalSrc: string;
  altText: string;
  imageNode: Node;
  caption?: string;
  cdnEndpoint?: string;
};

/**
 * Represents a mapping of image source updates
 */
export type ImageUpdateMap = {
  originalSrc: string;
  newSrc: string;
};

/**
 * Represents a blog post in @wjt/service
 */
export interface IBlogPost {
  rawPost: RawMarkdownPost;
  parsedPost: Post;
  postMarkup: string;
  postImages?: PostImage[];
  blogImages?: BlogImage[];

  updateImageSources(imageUpdateMap: ImageUpdateMap[]): void;
}

export class BlogPost implements IBlogPost {
  parsedPost: Post;
  postMarkup: string;
  postImages?: PostImage[] | undefined;
  blogImages?: BlogImage[] = [];

  private _imageNodes?: Node[] | undefined;

  constructor(public rawPost: RawMarkdownPost) {
    this.parsedPost = parseRawMarkdownPost(rawPost);
    this.postMarkup = renderPost(this.parsedPost);
    this._imageNodes = getImageNodes(this.parsedPost.content);
    this.initPostImages();
    this.initBlogImages();
  }

  private initPostImages(): void {
    this.postImages = this._imageNodes?.map((node: Node) => {
      return generatePostImage(node);
    });
  }

  private initBlogImages(): void {
    this._imageNodes?.forEach((node: Node) => {
      this.blogImages?.push(new BlogImage(node));
    });
  }

  public updateImageSources(imageUpdateMap: ImageUpdateMap[]): void {
    const updatedPost = _updateImageSources(imageUpdateMap, this.parsedPost);

    this.parsedPost = updatedPost;
    this.postMarkup = renderPost(updatedPost);
  }

  public getBlogImagesToUpdate(): BlogImage[] {
    return this.blogImages?.filter(
      (blogImage: BlogImage) => !blogImage.isCDNPath
    );
  }
}
