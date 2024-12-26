"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCDNPath = exports.generatePostImage = exports.getImageNodes = exports.getRawBlogPost = exports.getRawPostFileNames = exports.getPath = exports.renderPost = exports.getFrontmatter = exports.parseRawPost = exports.listBucketContent = exports.postsPath = exports.requiredFields = exports.defaultFrontMatter = exports.defaultCDNMatcher = exports.styleRegex = exports.newlineRegex = exports.frontmatterDelimiterRegex = exports.frontmatterRegex = void 0;
const pug_1 = require("pug");
const commonmark_1 = require("commonmark");
const process_1 = require("process");
const path_1 = require("path");
const fs_1 = require("fs");
const wjt_spaces_client_1 = require("../wjt-spaces-client/wjt-spaces-client");
exports.frontmatterRegex = /---([\s\S]*?)---/g;
exports.frontmatterDelimiterRegex = /---/g;
exports.newlineRegex = /\n/g;
exports.styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
exports.defaultCDNMatcher = /https:\/\/wjt\.sfo2\.cdn\.digitaloceanspaces\.com\/.*/;
exports.defaultFrontMatter = {
    title: '',
    author: '',
    slug: '',
};
exports.requiredFields = Object.keys(exports.defaultFrontMatter);
exports.postsPath = process.env.NODE_ENV === 'test'
    ? 'src/posts'
    : process.env.POSTS_PATH || 'src/posts';
const wjtSpacesClient = (0, wjt_spaces_client_1.wjtSpaceClientFactory)({
    forcePathStyle: false,
    endpoint: process.env.WJT_SPACES_ENDPOINT || wjt_spaces_client_1.WJT_SPACES_ENDPOINT,
    region: process.env.WJT_SPACES_REGION || wjt_spaces_client_1.WJT_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.WJT_SPACES_CLIENT_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.WJT_SPACES_CLIENT_SECRET || '',
    },
});
const listBucketContent = async () => {
    return await wjtSpacesClient.getBucketContents();
};
exports.listBucketContent = listBucketContent;
/**
 * Returns an array of parsed post objects
 * @returns {Post[]}
 */
const parseRawPost = (rawPost) => {
    return {
        frontMatter: (0, exports.getFrontmatter)(rawPost),
        content: rawPost?.replace(exports.frontmatterRegex, '').trim(),
    };
};
exports.parseRawPost = parseRawPost;
/**
 * Returns the frontmatter of a post or throws if any required fields are missing
 * @param {RawPost }rawPost
 * @returns {DefaultFrontMatter}
 */
const getFrontmatter = (rawPost) => {
    const rawFrontmatter = rawPost
        .match(exports.frontmatterRegex)?.[0]
        // Removes the frontmatter delimiter from the frontmatter string
        .replace(exports.frontmatterDelimiterRegex, '')
        .trim();
    if (!rawFrontmatter) {
        throw new Error(`Frontmatter is missing in the post: ${rawPost}`);
    }
    const parsedFrontmatter = rawFrontmatter
        .split(exports.newlineRegex)
        .reduce((acc, line) => {
        const [key, value] = line.split(':').map((str) => str.trim());
        return {
            ...acc,
            [key]: value,
        };
    }, exports.defaultFrontMatter);
    exports.requiredFields.forEach((field) => {
        if (!parsedFrontmatter[field]) {
            throw new Error(`Missing required frontmatter field: ${field} in post: ${rawPost}`);
        }
    });
    return parsedFrontmatter;
};
exports.getFrontmatter = getFrontmatter;
/**
 * Accepts a post object and returns the rendered post as a UTF-8 string. This string can be written to an HTML file and server to the client.
 * @param {Post} post
 * @returns {string} The rendered post
 */
const renderPost = (post) => {
    const { frontMatter, content } = post;
    const headTemplate = (0, pug_1.renderFile)((0, exports.getPath)('src/views/templates/head.pug'), {
        title: frontMatter.title.trim(),
    }).replace(exports.styleRegex, '');
    const parsedContent = new commonmark_1.Parser().parse(content);
    const writer = new commonmark_1.HtmlRenderer();
    const html = writer.render(parsedContent);
    const withWrapper = `<div class="post">${html}</div>`;
    const openTag = '<html>';
    const closeTag = '</html>';
    const finalRender = ``.concat(openTag, headTemplate, styleTemplate, withWrapper, closeTag);
    return finalRender;
};
exports.renderPost = renderPost;
/**
 * Wraps relative paths with the current working directory and returns the full path
 * @param {string} subpath
 * @returns {string}
 */
const getPath = (subpath) => {
    if (process.env.NODE_ENV === 'test') {
        return subpath;
    }
    return (0, path_1.join)((0, process_1.cwd)(), `apps/wjt/${subpath}`);
};
exports.getPath = getPath;
/**
 * Returns the minified default stylesheet for the application
 * @returns {string} The contents of the minified stylesheet
 */
const getStylesheet = () => (0, fs_1.readFileSync)((0, exports.getPath)('src/views/styles/min.css'), 'utf-8');
const styleTemplate = `<style>${getStylesheet()}</style>`;
/**
 * Returns the markdown file names in the posts directory
 * @returns {string[]}
 */
const getRawPostFileNames = () => {
    return (0, fs_1.readdirSync)(exports.postsPath).filter((file) => file.endsWith('.md'));
};
exports.getRawPostFileNames = getRawPostFileNames;
/**
 * Returns the raw post content of a markdown file based on file name
 * @param {string} rawPostFileName
 * @returns {RawPost}
 */
const getRawBlogPost = (rawPostFileName) => {
    const rawPostPath = (0, path_1.join)(exports.postsPath, rawPostFileName);
    return (0, fs_1.readFileSync)(rawPostPath, 'utf8');
};
exports.getRawBlogPost = getRawBlogPost;
/**
 * Returns an array of image nodes from the post content
 * @param {Post['content']} postContent
 * @returns {Node[]} - Commonmark Parser Nodes
 */
const getImageNodes = (postContent) => {
    let imageNodesSet = new Set();
    const parsedContent = new commonmark_1.Parser().parse(postContent);
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
exports.getImageNodes = getImageNodes;
/**
 * Returns a PostImage object from a Commonmark Node
 * @param {Node} imageNode
 * @returns {PostImage}
 */
const generatePostImage = (imageNode) => {
    const { destination } = imageNode;
    if (!destination) {
        throw new Error('generatePostImage: Image node does not have a destination.\n\n' +
            JSON.stringify(imageNode, null, 2));
    }
    return {
        originalSrc: destination,
        altText: imageNode.firstChild?.literal || '',
        imageNode,
        cdnEndpoint: (0, exports.isCDNPath)(destination) ? destination : undefined,
    };
};
exports.generatePostImage = generatePostImage;
/**
 * Checks if the path points to the CDN and not a local path
 * @param {string} src - src path
 * @param {RegExp} matcher
 * @returns {boolean}
 */
const isCDNPath = (src, matcher = exports.defaultCDNMatcher) => {
    return matcher.test(src);
};
exports.isCDNPath = isCDNPath;
