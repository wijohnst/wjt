import { HtmlRenderer, Node, HtmlRenderingOptions } from 'commonmark';

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

const potentiallyUnsafe = function (url) {
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};
export class BlogPostRenderer extends HtmlRenderer {
  options: HtmlRenderingOptions;
  constructor(options: HtmlRenderingOptions = {}) {
    super();
    this.options = options;
  }

  image!: (node: Node, entering: boolean) => void;
}

BlogPostRenderer.prototype.image = function (node, entering) {
  if (entering) {
    if (this.disableTags === 0) {
      if (this.options.safe && potentiallyUnsafe(node.destination)) {
        this.lit('<picture><img src="" alt="');
      } else {
        // Generate a WebP alternative by replacing the extension
        const webpSrc = node.destination.replace(/\.\w+$/, '.webp');
        this.lit(
          `<picture>
            ${getSource(webpSrc)}
          <img src="${this.esc(node.destination)}" alt="`
        );
      }
    }
    this.disableTags += 1;
  } else {
    this.disableTags -= 1;
    if (this.disableTags === 0) {
      if (node.title) {
        this.lit(`" title="${this.esc(node.title)}`);
      }
      this.lit('" /></picture>');
    }
  }
};

export const getSource = (escapedFileName: string): string => {
  return `<source srcset="${escapedFileName}" type="image/webp">`;
};
