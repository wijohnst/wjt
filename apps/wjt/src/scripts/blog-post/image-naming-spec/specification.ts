import { Node as MarkdownNode, HtmlRenderer } from 'commonmark';

export type ImageMetaData = {
  altText: string;
  height: number;
  width: number;
};

export type ParsedCommonmarkImage = {
  alt: string;
  src: string;
};

/**
 * Checks if the given node is an image
 * @param {Node} node - CommonMark Node
 * @returns {boolean}
 */
export const isCommonmarkImage = (node: MarkdownNode): boolean => {
  return node.type === 'image';
};

/**
 * Parses a CommonMark image node into a structured object
 * @param {Node} node - CommonMark Node
 * @returns {ParsedCommonmarkImage}
 */
export const parseCommonmarkImage = (
  node: MarkdownNode
): ParsedCommonmarkImage => {
  if (isCommonmarkImage(node)) {
    return {
      alt: node.firstChild.literal,
      src: node.destination,
    };
  }

  throw new Error(
    'parseCommonmarkImage error: Node is not a valid commonmark image'
  );
};
const altTextRegex = /^([a-zA-Z-]+)\$(\d+)x(\d+)$/;
const validFileExtensions = /\.(jpg|jpeg|png|svg)$/;

/**
 * Checks if the string is a valid alt text according to the naming convention spec
 * @param {string} text
 * @returns {boolean}
 */
export const isAltText = (text: string): boolean => {
  return altTextRegex.test(text);
};

/**
 * Checks if the string is a valid file extension according to the naming convention spec
 * @param {string} url
 * @returns {boolean}
 */
export const isValidFileExtension = (url: string): boolean => {
  return validFileExtensions.test(url);
};

/**
 * Parses the meta text from the alt text, returning the alt text, height, and width
 * @param {string} target
 * @returns
 */
export const parseMetaText = (target: string): ImageMetaData => {
  const match = altTextRegex.exec(target);

  if (match) {
    return {
      altText: match[1],
      height: parseInt(match[2]),
      width: parseInt(match[3]),
    };
  }

  throw new Error('Image naming syntax error - could not parse meta text');
};
