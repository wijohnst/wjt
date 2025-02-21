import { Node, Parser } from 'commonmark';

import {
  parseCommonmarkImage,
  ParsedCommonmarkImage,
  isAltText,
  isValidFileExtension,
} from './specification';

export type ImageNameValidationError = {
  documentPath: string;
  imageData: ParsedCommonmarkImage;
  message: string;
};

export class ImageNameValidator {
  public errors: ImageNameValidationError[] = [];

  private documentPath: string;
  private document: string;
  private parsedDocument: Node;
  private imageNodes: Node[];
  private _parsedCommonmarkData: ParsedCommonmarkImage[];

  constructor(markdownDocument: string, documentPath: string) {
    this.documentPath = documentPath;
    this.document = markdownDocument;
    this.parsedDocument = this.parseMarkdown();
    this.imageNodes = this.parseImageNodes();
    this.parseImageData();
    this.validate();
  }

  /**
   * Parses the markdown document and returns a Commonmark node
   * @returns {Node} - A parsed markdown document
   */
  private parseMarkdown(): Node {
    const parser = new Parser();
    return parser.parse(this.document);
  }

  /**
   * Returns all unique image nodes in the parsed document
   * @returns {Node[]} - An array of image nodes
   */
  private parseImageNodes(): Node[] {
    const imageNodes: Node[] = [];

    const walker = this.parsedDocument.walker();

    let pos;
    while ((pos = walker.next())) {
      const { node } = pos;
      if (node.type === 'image' && !imageNodes.includes(node)) {
        imageNodes.push(node);
      }
    }

    return imageNodes;
  }

  /**
   * Getter for image nodes
   * @returns {Node[]} - An array of image nodes
   */
  public getImageNodes(): Node[] {
    return this.imageNodes;
  }

  /**
   * Parses the image nodes into structured data
   */
  public parseImageData(): void {
    this._parsedCommonmarkData = this.imageNodes.map((node) =>
      parseCommonmarkImage(node)
    );
  }

  /**
   * Getter for parsedCommonmarkData
   */
  get parsedCommonmarkData(): ParsedCommonmarkImage[] {
    return this._parsedCommonmarkData;
  }

  /**
   * Checks that the alt text of the image is valid according to the image naming specification; invalid alt texts are pushed to the errors array
   * @returns {boolean}
   */
  private validateAltTexts(): void {
    this._parsedCommonmarkData.forEach((imageData) => {
      if (!isAltText(imageData.alt)) {
        this.errors.push({
          documentPath: this.documentPath,
          imageData,
          message: 'Invalid alt text',
        });
      }
    });
  }

  private validateImageSources(): void {
    this._parsedCommonmarkData.forEach((imageData) => {
      if (!isValidFileExtension(imageData.src)) {
        this.errors.push({
          documentPath: this.documentPath,
          imageData,
          message: 'Invalid file extension. Must be .jpg, .jpeg, .png, or .svg',
        });
      }
    });
  }

  private validate(): void {
    this.validateAltTexts();
    this.validateImageSources();
  }
}
