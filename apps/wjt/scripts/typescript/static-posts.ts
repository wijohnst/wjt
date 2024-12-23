import fs from 'fs';
import { Parser, HtmlRenderer } from 'commonmark';
import { compileFile } from 'pug';

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

const getStylesheet = () =>
  fs.readFileSync('src/views/styles/min.css', 'utf-8');

const styleTemplate = `<style>${getStylesheet()}</style>`;

/**
 * Returns the markdown content of all posts in the `src/posts` directory
 * @returns {Post[]} An array of raw post content, including frontmatter
 */
export const getRawPosts = (): RawPost[] => {
  const postsPath = 'src/posts';
  const files = fs
    .readdirSync(postsPath)
    .filter((file) => file.endsWith('.md'));

  return files.map((file) => {
    const fileData = fs.readFileSync(`${postsPath}/${file}`, 'utf-8');
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
  const headTemplate = compileFile('src/views/templates/head.pug')({
    title: frontMatter.title,
  }).replace(styleRegex, '');
  const parsedContent = new Parser().parse(content);
  const writer = new HtmlRenderer();
  const html = writer.render(parsedContent);
  const withWrapper = `<div class="post">${html}</div>`;

  const finalRender = ''.concat(headTemplate, styleTemplate, withWrapper);

  return finalRender;
};
