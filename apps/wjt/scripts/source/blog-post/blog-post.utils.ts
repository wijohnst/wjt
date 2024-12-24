import { renderFile } from 'pug';
import { Parser, HtmlRenderer } from 'commonmark';
import { cwd } from 'process';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';

import { DefaultFrontMatter, RawPost, Post } from './blog-post';
export const frontmatterRegex = /---([\s\S]*?)---/g;
export const frontmatterDelimiterRegex = /---/g;
export const newlineRegex = /\n/g;
export const styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
export const defaultFrontMatter: DefaultFrontMatter = {
  title: '',
  author: '',
  slug: '',
};
export const requiredFields = Object.keys(defaultFrontMatter);
export const postsPath =
  process.env.NODE_ENV === 'test'
    ? 'src/posts'
    : process.env.POSTS_PATH || 'src/posts';

/**
 * Returns an array of parsed post objects
 * @returns {Post[]}
 */
export const parseRawPost = (rawPost: RawPost): Post => {
  return {
    frontMatter: getFrontmatter(rawPost),
    content: rawPost?.replace(frontmatterRegex, '').trim(),
  };
};

/**
 * Returns the frontmatter of a post or throws if any required fields are missing
 * @param {RawPost }rawPost
 * @returns {DefaultFrontMatter}
 */
export const getFrontmatter = (rawPost: RawPost): DefaultFrontMatter => {
  const rawFrontmatter = rawPost
    .match(frontmatterRegex)?.[0]
    // Removes the frontmatter delimiter from the frontmatter string
    .replace(frontmatterDelimiterRegex, '')
    .trim();

  if (!rawFrontmatter) {
    throw new Error(`Frontmatter is missing in the post: ${rawPost}`);
  }

  const parsedFrontmatter = rawFrontmatter
    .split(newlineRegex)
    .reduce((acc, line) => {
      const [key, value] = line.split(':').map((str) => str.trim());

      return {
        ...acc,
        [key]: value,
      };
    }, defaultFrontMatter);

  requiredFields.forEach((field) => {
    if (!parsedFrontmatter[field]) {
      throw new Error(
        `Missing required frontmatter field: ${field} in post: ${rawPost}`
      );
    }
  });

  return parsedFrontmatter;
};

/**
 * Accepts a post object and returns the rendered post as a UTF-8 string. This string can be written to an HTML file and server to the client.
 * @param {Post} post
 * @returns {string} The rendered post
 */
export const renderPost = (post: Post): string => {
  const { frontMatter, content } = post;
  const headTemplate = renderFile(getPath('src/views/templates/head.pug'), {
    title: frontMatter.title.trim(),
  }).replace(styleRegex, '');

  const parsedContent = new Parser().parse(content);
  const writer = new HtmlRenderer();
  const html = writer.render(parsedContent);

  const withWrapper = `<div class="post">${html}</div>`;
  const openTag = '<html>';
  const closeTag = '</html>';

  const finalRender = ``.concat(
    openTag,
    headTemplate,
    styleTemplate,
    withWrapper,
    closeTag
  );

  return finalRender;
};

/**
 * Wraps relative paths with the current working directory and returns the full path
 * @param {string} subpath
 * @returns {string}
 */
export const getPath = (subpath: string): string => {
  if (process.env.NODE_ENV === 'test') {
    return subpath;
  }
  return join(cwd(), `apps/wjt/${subpath}`);
};

/**
 * Returns the minified default stylesheet for the application
 * @returns {string} The contents of the minified stylesheet
 */
const getStylesheet = (): string =>
  readFileSync(getPath('src/views/styles/min.css'), 'utf-8');

const styleTemplate = `<style>${getStylesheet()}</style>`;

/**
 * Returns the markdown file names in the posts directory
 * @returns {string[]}
 */
export const getRawPostFileNames = (): string[] => {
  return readdirSync(postsPath).filter((file) => file.endsWith('.md'));
};

export const getRawBlogPost = (rawPostFileName: string): RawPost => {
  const rawPostPath = join(postsPath, rawPostFileName);
  return readFileSync(rawPostPath, 'utf8');
};
