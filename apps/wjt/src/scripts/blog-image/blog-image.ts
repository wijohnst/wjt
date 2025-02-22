import { getBufferFromPath } from '@wjt/images';

export class BlogImage {
  private fallbackSrcPath: string;
  public _imageBuffer: Buffer;

  constructor(srcPath: string) {
    this.fallbackSrcPath = srcPath;
  }

  async generateImageBuffer(): Promise<void> {
    try {
      this._imageBuffer = await getBufferFromPath(this.fallbackSrcPath);
    } catch (e) {
      console.error('BlogImage Error: error generating image buffer', e);
    }
  }

  get imageBuffer(): Buffer {
    if (!this._imageBuffer) {
      console.error('BlogImage Error: image buffer not generated');
      return;
    }

    return this._imageBuffer;
  }
}
