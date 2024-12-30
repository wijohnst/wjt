import { writeFileSync } from 'fs';
import {
  Post,
  ImageUpdateMap,
  updateImageSources,
  postsPath,
} from '../blog-post';
import { join } from 'path';

export const updateMarkdown = (
  targetFileName: string,
  parsedPost: Post,
  imageUpdateMap: ImageUpdateMap[]
): string => {
  const frontmatter = generateFrontmatterString(parsedPost.frontMatter);
  const updatedPost = updateImageSources(imageUpdateMap, parsedPost);
  const finalPost = `${frontmatter}\n\n${updatedPost.content}`;
  writeFileSync(join(postsPath, targetFileName), finalPost);
  return finalPost;
};

export const generateFrontmatterString = (
  frontmatter: Post['frontMatter']
): string => {
  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => `${key.trim()}: ${value}`)
    .map((str) => `${str}`)
    .join('\n');

  return `---\n${frontmatterString}\n---`;
};
