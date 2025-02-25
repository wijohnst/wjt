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
type SourceSetString = string & { __brand: 'SourceSetString' };

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
  public sourceSet: SourceSetString[];

  constructor(
    node: Node,
    CDN_MATCHER = DEFAULT_CDN_MATCHER,
    TARGET_CDN_PATH = WJT_SPACES_CDN_ENDPOINT,
    responsiveImageWidths: ResponsiveImageWidths = DEFAULT_SOURCE_SET
  ) {
    this.self = node;
    this.fallbackSrcPath = this.self.destination;
    this._isCDNPath = _isCDNImage(this.fallbackSrcPath, CDN_MATCHER);
    this.CDN_PATH = TARGET_CDN_PATH;
    this.responsiveImageWidths = responsiveImageWidths;
    this.initImageData();
    this.initSourceSet();
  }

  /**
   * Generates a buffer from the image path
   * @returns Promise<void>
   */
  async generateImageBuffer(): Promise<void> {
    try {
      this._imageBuffer = await getBufferFromPath(this.fallbackSrcPath);
    } catch (e) {
      console.error('BlogImage Error: error generating image buffer', e);
    }
  }

  /**
   * Initializes image metadata from Commonmark image node
   * @returns void
   */
  private initImageData(): void {
    try {
      const { alt, src } = parseCommonmarkImage(this.self);
      this._imageMetaData = parseMetaText(alt);
      this._imageSrc = src;
    } catch (error) {
      console.error('BlogImage Error: error parsing image metadata', error);
    }
  }

  /**
   * Initializes the source set for the image
   * @returns {SourceSetString[]}
   */
  private initSourceSet(): void {
    this.sourceSet = generateSrcSet(
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
    const [imageName] = this.fallbackSrcPath.split('/').reverse()[0].split('.');
    return imageName;
  }
}

// UTILS

/**
 * Generates a source set for the image
 * @param {ResponsiveImageWidths} responsiveImageWidths
 * @param {string} cdnPath
 * @param {string} imageName
 * @returns
 */
export const generateSrcSet = (
  responsiveImageWidths: ResponsiveImageWidths,
  cdnPath: string,
  imageName: string
): SourceSetString[] => {
  return responsiveImageWidths.map((width) => {
    const sourceSetString = generateSourceSetString(
      `${cdnPath}/${imageName}-${width}w.webp ${width}w`
    );

    return sourceSetString;
  });
};

/**
 * SourceSetString factory
 * @param {string} value
 * @param {RegExp} cdnMatcher - default is DEFAULT_CDN_MATCHER
 * @returns {SourceSetString}
 */
export const generateSourceSetString = (
  value: string,
  cdnMatcher: RegExp = DEFAULT_CDN_MATCHER
): SourceSetString => {
  if (!isValidSourceSetString(value, cdnMatcher)) {
    throw new Error('Invalid source set string');
  }
  return value as SourceSetString;
};

/**
 * Type guard for SourceSetString
 * @param {string} value
 * @param {RegExp} cdnMatcher - default is DEFAULT_CDN_MATCHER
 * @returns {boolean}
 */
export const isValidSourceSetString = (
  value: string,
  cdnMatcher: RegExp = DEFAULT_CDN_MATCHER
): boolean => {
  return cdnMatcher.test(value);
};
