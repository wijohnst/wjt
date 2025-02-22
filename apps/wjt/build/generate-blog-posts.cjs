var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// apps/wjt/src/scripts/utils/utils.ts
var import_path3 = require("path");

// libs/images/src/lib/convert.ts
var import_sharp = __toESM(require("sharp"));

// libs/images/src/lib/utils.ts
var isCdnImage = (path, matcher) => {
  return matcher.test(path);
};

// apps/wjt/src/scripts/blog-post/blog-post.utils.ts
var import_pug = require("pug");
var import_commonmark = require("commonmark");
var import_process = require("process");
var import_path = require("path");
var import_fs = require("fs");

// apps/wjt/src/scripts/wjt-spaces-client/wjt-spaces-client.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var WJT_SPACES_BUCKET_ID = `wjt`;
var WJT_SPACES_CDN_ENDPOINT = `https://wjt.sfo2.cdn.digitaloceanspaces.com`;
var WJT_SPACES_ENDPOINT = `https://sfo2.digitaloceanspaces.com`;
var WJT_SPACES_REGION = `sfo2`;
var DEFAULT_CDN_MATCHER = /https:\/\/wjt\.sfo2\.cdn\.digitaloceanspaces\.com\/.*.webp/;
var wjtSpacesClientDefaultConfig = {
  region: WJT_SPACES_REGION,
  endpoint: WJT_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WJT_SPACES_CLIENT_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.WJT_SPACES_CLIENT_SECRET ?? ""
  }
};
var WjtSpacesClient = class {
  constructor(s3Client, bucketId = WJT_SPACES_BUCKET_ID) {
    this.s3Client = s3Client;
    this.bucketId = bucketId;
  }
  getBucketId() {
    return this.bucketId;
  }
  async getBucketContents() {
    const params = {
      Bucket: this.bucketId
    };
    const command = new import_client_s3.ListObjectsV2Command(params);
    try {
      const { Contents } = await this.s3Client.send(command);
      return Contents;
    } catch (error) {
      console.error(error);
    }
  }
  async putWebpObject(params) {
    const input = {
      ...params,
      Bucket: this.bucketId,
      ContentType: "image/webp",
      ACL: "public-read"
    };
    const command = new import_client_s3.PutObjectCommand(input);
    const cdnEndpointUrl = `${WJT_SPACES_CDN_ENDPOINT}/${params.Key}`;
    try {
      const s3Response = await this.s3Client.send(command);
      return { ...s3Response, cdnEndpointUrl };
    } catch (error) {
      console.error(error);
    }
  }
};
var wjtSpacesClientFactory = (config) => {
  return new WjtSpacesClient(new import_client_s3.S3Client(config));
};

// apps/wjt/src/scripts/blog-post/blog-post.utils.ts
var frontmatterRegex = /---([\s\S]*?)---/g;
var frontmatterDelimiterRegex = /---/g;
var newlineRegex = /\n/g;
var styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
var defaultCDNMatcher = /https:\/\/wjt\.sfo2\.cdn\.digitaloceanspaces\.com\/.*/;
var defaultFrontMatter = {
  title: "",
  author: "",
  slug: "",
  description: ""
};
var requiredFields = Object.keys(defaultFrontMatter);
var postsPath = process.env.NODE_ENV === "test" ? "src/posts" : process.env.POSTS_PATH || "src/posts";
var wjtSpacesClient = wjtSpacesClientFactory({
  forcePathStyle: false,
  endpoint: process.env.WJT_SPACES_ENDPOINT || WJT_SPACES_ENDPOINT,
  region: process.env.WJT_SPACES_REGION || WJT_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.WJT_SPACES_CLIENT_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.WJT_SPACES_CLIENT_SECRET || ""
  }
});
var parseRawMarkdownPost = (rawPost) => {
  return {
    frontMatter: getFrontmatter(rawPost),
    content: rawPost?.replace(frontmatterRegex, "").trim()
  };
};
var getFrontmatter = (rawPost) => {
  const rawFrontmatter = rawPost.match(frontmatterRegex)?.[0].replace(frontmatterDelimiterRegex, "").trim();
  if (!rawFrontmatter) {
    throw new Error(`Frontmatter is missing in the post: ${rawPost}`);
  }
  const parsedFrontmatter = rawFrontmatter.split(newlineRegex).reduce((acc, line) => {
    const [key, value] = line.split(":").map((str) => str.trim());
    return {
      ...acc,
      [key]: value
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
var renderPost = (post) => {
  const { frontMatter, content } = post;
  const headTemplate = (0, import_pug.renderFile)(getPath("src/views/templates/head.pug"), {
    title: frontMatter.title.trim()
  }).replace(styleRegex, "");
  const parsedContent = new import_commonmark.Parser().parse(content);
  const writer = new import_commonmark.HtmlRenderer();
  const html = writer.render(parsedContent);
  const withWrapper = `<div class="post">${html}</div>`;
  const openTag = '<!DOCTYPE html><html lang="en">';
  const closeTag = "</html>";
  const finalRender = ``.concat(
    openTag,
    headTemplate,
    styleTemplate,
    withWrapper,
    closeTag
  );
  return finalRender;
};
var getPath = (subpath) => {
  if (process.env.NODE_ENV === "test") {
    return subpath;
  }
  return (0, import_path.join)((0, import_process.cwd)(), `apps/wjt/${subpath}`);
};
var getStylesheet = () => (0, import_fs.readFileSync)(getPath("src/views/styles/min.css"), "utf-8");
var styleTemplate = `<style>${getStylesheet()}</style>`;
var getRawPostFileNames = () => {
  return (0, import_fs.readdirSync)(postsPath).filter((file) => file.endsWith(".md"));
};
var getRawBlogPost = (rawPostFileName) => {
  const rawPostPath = (0, import_path.join)(postsPath, rawPostFileName);
  return (0, import_fs.readFileSync)(rawPostPath, "utf8");
};
var getImageNodes = (postContent) => {
  const imageNodesSet = /* @__PURE__ */ new Set();
  const parsedContent = new import_commonmark.Parser().parse(postContent);
  const walker = parsedContent.walker();
  let event = walker.next();
  while (event) {
    const { node } = event;
    if (node.type === "image") {
      imageNodesSet.add(node);
    }
    event = walker.next();
  }
  return Array.from(imageNodesSet);
};
var generatePostImage = (imageNode) => {
  const { destination } = imageNode;
  if (!destination) {
    throw new Error(
      "generatePostImage: Image node does not have a destination.\n\n" + JSON.stringify(imageNode, null, 2)
    );
  }
  return {
    originalSrc: destination,
    altText: imageNode.firstChild?.literal || "",
    imageNode,
    cdnEndpoint: isCDNPath(destination) ? destination : void 0
  };
};
var isCDNPath = (src, matcher = defaultCDNMatcher) => {
  return matcher.test(src);
};
var _updateImageSources = (imageUpdates, post) => {
  const postCopy = { ...post };
  for (const { originalSrc, newSrc } of imageUpdates) {
    const imagePathMatcher = new RegExp(
      `(!\\[.*?\\]\\()${originalSrc.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )}(\\))`,
      "g"
    );
    postCopy.content = postCopy.content.replace(
      imagePathMatcher,
      `$1${newSrc}$2`
    );
  }
  return {
    frontMatter: postCopy.frontMatter,
    content: postCopy.content
  };
};

// apps/wjt/src/scripts/blog-post/blog-post.ts
var BlogPost = class {
  constructor(rawPost) {
    this.rawPost = rawPost;
    this.parsedPost = parseRawMarkdownPost(rawPost);
    this.postMarkup = renderPost(this.parsedPost);
    this._imageNodes = getImageNodes(this.parsedPost.content);
    this.initPostImages();
  }
  initPostImages() {
    this.postImages = this._imageNodes?.map((node) => {
      return generatePostImage(node);
    });
  }
  updateImageSources(imageUpdateMap) {
    const updatedPost = _updateImageSources(imageUpdateMap, this.parsedPost);
    this.parsedPost = updatedPost;
    this.postMarkup = renderPost(updatedPost);
  }
};

// apps/wjt/src/scripts/blog-post/blog-post.mocks.ts
var rawPosts = [
  [
    "---",
    "title: Post 1",
    "author: Some Author",
    "slug: post-1",
    "description: This is a sample mock post used for testing.",
    "---",
    "# Post 1\n",
    "This is the first post.",
    "![image$100x200](./path/to/image-1.jpg)"
  ],
  [
    "---",
    "title: Post 2",
    "author: Another Author",
    "slug: post-2",
    "description: This is another sample mock post used for testing.",
    "---",
    "# Post 2\n",
    "This is the second post.",
    "![cdn-image$200x200](https://wjt.sfo2.cdn.digitaloceanspaces.com/wjt_logo.ico)"
  ],
  [
    "---",
    "title: Post 3",
    "author: Yet Another Author",
    "---",
    "# Post 3\n",
    "This is the third post."
  ]
];
var mockHeadTemplate = `
head 
    title #{title || 'willjohnston.tech'} 
    meta(name="viewport" content="width=device-width, initial-scale=1")
    meta(name="description" content=description ? description : 'willjohnston.tech')
    link(rel='icon' href='https://wjt.sfo2.cdn.digitaloceanspaces.com/wjt_logo.ico')
    link(rel='stylesheet' href='min.css')
`;
var getMockPostContent = (mockValues) => {
  return mockValues.join("\n");
};
var rawPostMocks = [
  getMockPostContent(rawPosts[0]),
  getMockPostContent(rawPosts[1]),
  getMockPostContent(rawPosts[2])
];
var rawFrontmatterMocks = [
  getMockPostContent(rawPosts[0].slice(0, 6)),
  getMockPostContent(rawPosts[1].slice(0, 6)),
  getMockPostContent(rawPosts[2].slice(0, 5))
];
var rawContentMocks = [
  getMockPostContent(rawPosts[0].slice(6)),
  getMockPostContent(rawPosts[1].slice(6)),
  getMockPostContent(rawPosts[2].slice(5))
];
var mockFileSystem = {
  "src/posts/example-post.md": rawPostMocks[0],
  "src/posts/example-post-2.md": rawPostMocks[1],
  "src/posts/example-post-3.md": rawPostMocks[2],
  "src/views/templates/head.pug": mockHeadTemplate
};

// apps/wjt/src/scripts/blog-post/image-naming-spec/image-name-validator.ts
var import_commonmark2 = require("commonmark");

// apps/wjt/src/scripts/blog-post/image-naming-spec/specification.ts
var isCommonmarkImage = (node) => {
  return node.type === "image";
};
var parseCommonmarkImage = (node) => {
  if (isCommonmarkImage(node)) {
    return {
      alt: node.firstChild.literal,
      src: node.destination
    };
  }
  throw new Error(
    "parseCommonmarkImage error: Node is not a valid commonmark image"
  );
};
var altTextRegex = /^([a-zA-Z-]+)\$(\d+)x(\d+)$/;
var validFileExtensions = /\.(jpg|jpeg|png|svg)$/;
var isAltText = (text) => {
  return altTextRegex.test(text);
};
var isValidFileExtension = (url) => {
  return validFileExtensions.test(url);
};

// apps/wjt/src/scripts/blog-post/image-naming-spec/image-name-validator.ts
var ImageNameValidator = class {
  constructor(markdownDocument, documentPath) {
    this.errors = [];
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
  parseMarkdown() {
    const parser = new import_commonmark2.Parser();
    return parser.parse(this.document);
  }
  /**
   * Returns all unique image nodes in the parsed document
   * @returns {Node[]} - An array of image nodes
   */
  parseImageNodes() {
    const imageNodes = [];
    const walker = this.parsedDocument.walker();
    let pos;
    while (pos = walker.next()) {
      const { node } = pos;
      if (node.type === "image" && !imageNodes.includes(node)) {
        imageNodes.push(node);
      }
    }
    return imageNodes;
  }
  /**
   * Getter for image nodes
   * @returns {Node[]} - An array of image nodes
   */
  getImageNodes() {
    return this.imageNodes;
  }
  /**
   * Parses the image nodes into structured data
   */
  parseImageData() {
    this._parsedCommonmarkData = this.imageNodes.map(
      (node) => parseCommonmarkImage(node)
    );
  }
  /**
   * Getter for parsedCommonmarkData
   */
  get parsedCommonmarkData() {
    return this._parsedCommonmarkData;
  }
  /**
   * Checks that the alt text of the image is valid according to the image naming specification; invalid alt texts are pushed to the errors array
   * @returns {boolean}
   */
  validateAltTexts() {
    this._parsedCommonmarkData.forEach((imageData) => {
      if (!isAltText(imageData.alt)) {
        this.errors.push({
          documentPath: this.documentPath,
          imageData,
          message: "Invalid alt text"
        });
      }
    });
  }
  validateImageSources() {
    this._parsedCommonmarkData.forEach((imageData) => {
      if (!isValidFileExtension(imageData.src)) {
        this.errors.push({
          documentPath: this.documentPath,
          imageData,
          message: "Invalid file extension. Must be .jpg, .jpeg, .png, or .svg"
        });
      }
    });
  }
  validate() {
    this.validateAltTexts();
    this.validateImageSources();
  }
  get isValid() {
    return this.errors.length === 0;
  }
  getErrorOutput(error) {
    const { documentPath, imageData, message } = error;
    return `${documentPath}: ${message}. Image data: ${JSON.stringify(
      imageData,
      null,
      2
    )}
`;
  }
};

// apps/wjt/src/scripts/markdown-utils/markdown.utils.ts
var import_fs2 = require("fs");
var import_path2 = require("path");
var updateMarkdown = (targetFileName, parsedPost, imageUpdateMapArr) => {
  const frontmatter = generateFrontmatterString(parsedPost.frontMatter);
  const updatedPost = _updateImageSources(imageUpdateMapArr, parsedPost);
  const finalPost = `${frontmatter}

${updatedPost.content}`;
  (0, import_fs2.writeFileSync)((0, import_path2.join)(postsPath, targetFileName), finalPost);
  return finalPost;
};
var generateFrontmatterString = (frontmatter) => {
  const frontmatterString = Object.entries(frontmatter).map(([key, value]) => `${key.trim()}: ${value}`).map((str) => `${str}`).join("\n");
  return `---
${frontmatterString}
---`;
};

// apps/wjt/src/scripts/utils/utils.ts
var wjtSpacesClient2 = wjtSpacesClientFactory(wjtSpacesClientDefaultConfig);
var init = async () => {
  console.log("\u{1F4DD} Generating blog posts...\n");
  try {
    await processPosts(getRawPostFileNames());
  } catch (error) {
    console.error("Error processing posts:", error);
  }
};
var processPosts = async (rawPostFileNames) => {
  for (const rawPostFileName of rawPostFileNames) {
    const rawPost = getRawBlogPost(rawPostFileName);
    const imageNameValidator = new ImageNameValidator(rawPost, rawPostFileName);
    if (imageNameValidator.isValid) {
      const blogPost = new BlogPost(rawPost);
      const targetPath = (0, import_path3.join)(
        postsPath,
        blogPost.parsedPost.frontMatter.slug + ".html"
      );
      await handleImageConversion(rawPostFileName, blogPost);
    }
    imageNameValidator.errors.forEach((error) => {
      const errorOutput = imageNameValidator.getErrorOutput(error);
      console.error(errorOutput);
    });
  }
};
var handleImageConversion = async (rawPostFileName, blogPost) => {
  const imageUpdates = [];
  for (const postImage of blogPost.postImages) {
    if (isCdnImage(postImage.originalSrc, DEFAULT_CDN_MATCHER)) {
      console.log("\u2705 Image is already on CDN. Skipping conversion...\n");
      continue;
    }
    console.log(
      ` \u{1F501} ${postImage.originalSrc} is not on CDN. Converting to webp...
`
    );
    const targetPath = (0, import_path3.join)(postsPath, postImage.originalSrc);
    const targetFileExtension = targetPath.split(".").pop();
    const targetImageName = `${postImage.originalSrc.split("/").pop().split(".")[0]}.${targetFileExtension}`;
    console.log(targetImageName);
  }
  if (imageUpdates.length > 0) {
    console.log("\u{1F9D1}\u200D\u{1F4BB} Updating image sources in post...\n");
    blogPost.updateImageSources(imageUpdates);
    console.log("\u{1F4DD} Updating image sources in markdown file...\n");
    updateMarkdown(rawPostFileName, blogPost.parsedPost, imageUpdates);
  }
};

// apps/wjt/src/scripts/generate-blog-posts.ts
init();
