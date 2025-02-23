import { getBufferFromPath } from '@wjt/images';
import { Node } from 'commonmark';
import { isCdnImage as _isCDNImage } from '@wjt/images';
import {
  DEFAULT_CDN_MATCHER,
  WJT_SPACES_CDN_ENDPOINT,
} from '../wjt-spaces-client';
import {
  ImageMetaData,
  parseCommonmarkImage,
  parseMetaText,
} from '../blog-post';

type Width = number;
type ResponsiveImageWidths = Array<Width>;

const DEFAULT_SOURCE_SET: ResponsiveImageWidths = [320, 480, 800, 1600];

export class BlogImage {
  private readonly fallbackSrcPath: string;
  private readonly _isCDNPath: boolean;
  private readonly CDN_PATH: string;
  private readonly responsiveImageWidths: ResponsiveImageWidths;
  private readonly _imageName: string;

  private _imageSrc: string;
  private _imageMetaData: ImageMetaData;

  public _imageBuffer: Buffer;
  public self: Node;
  public sourceSet: string[];

  constructor(
    srcPath: string,
    node: Node,
    CDN_MATCHER = DEFAULT_CDN_MATCHER,
    TARGET_CDN_PATH = WJT_SPACES_CDN_ENDPOINT,
    responsiveImageWidths: ResponsiveImageWidths = DEFAULT_SOURCE_SET
  ) {
    this.self = node;
    this.fallbackSrcPath = srcPath;
    this._isCDNPath = _isCDNImage(srcPath, CDN_MATCHER);
    this.CDN_PATH = TARGET_CDN_PATH;
    this.responsiveImageWidths = responsiveImageWidths;
    this.initImageData();
    this.sourceSet = this.initSourceSet();
  }

  async generateImageBuffer(): Promise<void> {
    try {
      this._imageBuffer = await getBufferFromPath(this.fallbackSrcPath);
    } catch (e) {
      console.error('BlogImage Error: error generating image buffer', e);
    }
  }

  private initImageData(): void {
    try {
      const { alt, src } = parseCommonmarkImage(this.self);
      this._imageMetaData = parseMetaText(alt);
      this._imageSrc = src;
    } catch (error) {
      console.error('BlogImage Error: error parsing image metadata', error);
    }
  }

  private initSourceSet(): string[] {
    return generateSrcSet(
      this.responsiveImageWidths,
      this.CDN_PATH,
      this.imageName
    );
  }

  get imageBuffer(): Buffer {
    if (!this._imageBuffer) {
      console.error(
        'BlogImage Error: image buffer not generated. Run BlogImage.generateImageBuffer()'
      );
      return;
    }

    return this._imageBuffer;
  }

  get isCDNPath(): boolean {
    return this._isCDNPath;
  }

  get imageMetaData(): ImageMetaData {
    return this._imageMetaData;
  }

  get imageSrc(): string {
    return this._imageSrc;
  }

  get imageName(): string {
    const [imageName] = this._imageSrc.split('.');
    return imageName;
  }
}

// UTILS
export const generateSrcSet = (
  responsiveImageWidths: ResponsiveImageWidths,
  cdnPath: string,
  imageName: string
): string[] => {
  return responsiveImageWidths.map(
    (width) => `${cdnPath}/${imageName}-${width}w.webp ${width}w`
  );
};
