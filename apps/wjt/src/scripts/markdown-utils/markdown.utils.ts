import { writeFileSync } from 'fs';
import {
  Post,
  ImageUpdateMap,
  _updateImageSources,
  postsPath,
} from '../blog-post';
import { join } from 'path';

/**
 * Updates the markdown file with the new image sources and returns the updated markdown post
 * @param {string} targetFileName
 * @param {Post} parsedPost
 * @param {ImageUpdateMap[]} imageUpdateMapArr
 * @returns {string}
 */
export const updateMarkdown = (
  targetFileName: string,
  parsedPost: Post,
  imageUpdateMapArr: ImageUpdateMap[]
): string => {
  const frontmatter = generateFrontmatterString(parsedPost.frontMatter);
  const updatedPost = _updateImageSources(imageUpdateMapArr, parsedPost);
  const finalPost = `${frontmatter}\n\n${updatedPost.content}`;
  writeFileSync(join(postsPath, targetFileName), finalPost);

  return finalPost;
};

/**
 * Accepts a FrontMatter object and returns a string representation of the front matter
 * @param {Post['frontMatter']} frontmatter
 * @returns {string}
 */
export const generateFrontmatterString = (
  frontmatter: Post['frontMatter']
): string => {
  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => `${key.trim()}: ${value}`)
    .map((str) => `${str}`)
    .join('\n');

  return `---\n${frontmatterString}\n---`;
};
