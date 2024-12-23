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

const frontmatterRegex = /---([\s\S]*?)---/g;
const newlineRegex = /\n/g;
const styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
const defaultFrontMatter: DefaultFrontMatterData = {
  title: '',
  author: '',
  slug: '',
};
export const postsPath = 'src/posts';

export const getPath = (subpath: string) => {
  if (process.env.NODE_ENV === 'test') {
    return subpath;
  }
  return join(cwd(), `apps/wjt/${subpath}`);
};

const getStylesheet = () =>
  readFileSync(getPath('src/views/styles/min.css'), 'utf-8');

const styleTemplate = `<style>${getStylesheet()}</style>`;

export const getFiles = () => {
  return readdirSync(getPath(postsPath)).filter((file) => file.endsWith('.md'));
};

/**
 * Returns the markdown content of all posts in the `src/posts` directory
 * @returns {Post[]} An array of raw post content, including frontmatter
 */
export const getRawPosts = (): RawPost[] => {
  const files = getFiles();

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
 * Returns the frontmatter of a post
 * @param {RawPost }rawPost
 * @returns {DefaultFrontMatterData}
 */
export const getFrontmatter = (rawPost: RawPost): DefaultFrontMatterData => {
  const rawFrontmatter = rawPost.match(frontmatterRegex)?.[0] ?? '';

  return (
    rawFrontmatter.split(newlineRegex).reduce((acc, line) => {
      if (line === '---') return acc;

      const [key, value] = line.split(':').map((str) => str.trim());

      if (!key || !value) return acc;

      return {
        ...acc,
        [key]: value,
      };
    }, defaultFrontMatter) ?? defaultFrontMatter
  );
};

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

// const init = () => {
//   const posts = parseRawPosts();
//   posts.forEach((post) => {
//     const renderedPost = getRenderedPost(post);
//     console.log(renderedPost);
//   });
// };

// init();
