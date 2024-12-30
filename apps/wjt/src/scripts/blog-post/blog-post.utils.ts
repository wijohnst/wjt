import { renderFile } from 'pug';
import { Parser, HtmlRenderer, Node } from 'commonmark';
import { cwd } from 'process';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import {
  wjtSpacesClientFactory,
  WJT_SPACES_ENDPOINT,
  WJT_SPACES_REGION,
} from '../wjt-spaces-client';
import {
  DefaultFrontMatter,
  RawPost,
  Post,
  PostImage,
  ImageUpdateMap,
} from './blog-post';

export const frontmatterRegex = /---([\s\S]*?)---/g;
export const frontmatterDelimiterRegex = /---/g;
export const newlineRegex = /\n/g;
export const styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
export const defaultCDNMatcher =
  /https:\/\/wjt\.sfo2\.cdn\.digitaloceanspaces\.com\/.*/;
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

const wjtSpacesClient = wjtSpacesClientFactory({
  forcePathStyle: false,
  endpoint: process.env.WJT_SPACES_ENDPOINT || WJT_SPACES_ENDPOINT,
  region: process.env.WJT_SPACES_REGION || WJT_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.WJT_SPACES_CLIENT_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.WJT_SPACES_CLIENT_SECRET || '',
  },
});

export const listBucketContent = async () => {
  return await wjtSpacesClient.getBucketContents();
};

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

/**
 * Returns the raw post content of a markdown file based on file name
 * @param {string} rawPostFileName
 * @returns {RawPost}
 */
export const getRawBlogPost = (rawPostFileName: string): RawPost => {
  const rawPostPath = join(postsPath, rawPostFileName);
  return readFileSync(rawPostPath, 'utf8');
};

/**
 * Returns an array of image nodes from the post content
 * @param {Post['content']} postContent
 * @returns {Node[]} - Commonmark Parser Nodes
 */
export const getImageNodes = (postContent: Post['content']): Node[] => {
  const imageNodesSet = new Set<Node>();
  const parsedContent = new Parser().parse(postContent);
  const walker = parsedContent.walker();

  let event = walker.next();
  while (event) {
    const { node } = event;
    if (node.type === 'image') {
      imageNodesSet.add(node);
    }
    event = walker.next();
  }

  return Array.from(imageNodesSet);
};

/**
 * Returns a PostImage object from a Commonmark Node
 * @param {Node} imageNode
 * @returns {PostImage}
 */
export const generatePostImage = (imageNode: Node): PostImage => {
  const { destination } = imageNode;

  if (!destination) {
    throw new Error(
      'generatePostImage: Image node does not have a destination.\n\n' +
        JSON.stringify(imageNode, null, 2)
    );
  }

  return {
    originalSrc: destination,
    altText: imageNode.firstChild?.literal || '',
    imageNode,
    cdnEndpoint: isCDNPath(destination) ? destination : undefined,
  } as PostImage;
};

/**
 * Checks if the path points to the CDN and not a local path
 * @param {string} src - src path
 * @param {RegExp} matcher
 * @returns {boolean}
 */
export const isCDNPath = (
  src: string,
  matcher: RegExp = defaultCDNMatcher
): boolean => {
  return matcher.test(src);
};

export const updateImageSources = (
  imageUpdates: ImageUpdateMap[],
  post: Post
): Post => {
  const postCopy = { ...post };

  for (const { originalSrc, newSrc } of imageUpdates) {
    const imagePathMatcher = new RegExp(
      `(!\\[.*?\\]\\()${originalSrc.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )}(\\))`,
      'g'
    );
    postCopy.content = postCopy.content.replace(
      imagePathMatcher,
      `$1${newSrc}$2`
    );
  }

  return {
    frontMatter: postCopy.frontMatter,
    content: postCopy.content,
  };
};
