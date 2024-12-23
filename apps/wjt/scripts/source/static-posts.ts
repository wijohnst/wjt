import { readFileSync, readdirSync } from 'fs';
import { Parser, HtmlRenderer } from 'commonmark';
import { compileFile } from 'pug';
import { cwd } from 'process';
import { join } from 'path';

export type DefaultFrontMatterData = {
  title: string;
  author: string;
  slug: string;
};

export type RawPost = string;
export type Post = {
  frontMatter: DefaultFrontMatterData;
  content: string;
};

export const postsPath = 'src/posts';

const frontmatterRegex = /---([\s\S]*?)---/g;
const frontmatterDelimiterRegex = /---/g;
const newlineRegex = /\n/g;
const styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
const defaultFrontMatter: DefaultFrontMatterData = {
  title: '',
  author: '',
  slug: '',
};
const requiredFields = Object.keys(defaultFrontMatter);

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
 * Returns an array of markdown filename strings in the `src/posts` directory
 * @returns {string[]} An array of file names in the `src/posts` directory
 */
export const getMarkdownFiles = (): string[] => {
  return readdirSync(getPath(postsPath)).filter((file) => file.endsWith('.md'));
};

/**
 * Returns the markdown content of all posts in the `src/posts` directory
 * @returns {Post[]} An array of raw post content, including frontmatter
 */
export const getRawPosts = (): RawPost[] => {
  const files = getMarkdownFiles();

  return files.map((file) => {
    const fileData = readFileSync(getPath(`${postsPath}/${file}`), 'utf-8');
    return fileData;
  });
};

/**
 * Returns an array of parsed post objects
 * @returns {Post[]}
 */
export const parseRawPosts = (): Post[] => {
  const rawPosts = getRawPosts();

  return rawPosts.map((rawPost) => ({
    frontMatter: getFrontmatter(rawPost),
    content: rawPost?.replace(frontmatterRegex, '').trim(),
  }));
};

/**
 * Returns the frontmatter of a post or throws if any required fields are missing
 * @param {RawPost }rawPost
 * @returns {DefaultFrontMatterData}
 */
export const getFrontmatter = (rawPost: RawPost): DefaultFrontMatterData => {
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
export const getRenderedPost = (post: Post): string => {
  const { frontMatter, content } = post;
  const headTemplate = compileFile(getPath('src/views/templates/head.pug'))({
    title: frontMatter.title,
  }).replace(styleRegex, '');
  const parsedContent = new Parser().parse(content);
  const writer = new HtmlRenderer();
  const html = writer.render(parsedContent);
  const withWrapper = `<div class="post">${html}</div>`;

  const finalRender = ''.concat(headTemplate, styleTemplate, withWrapper);

  return finalRender;
};
