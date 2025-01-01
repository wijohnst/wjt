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

// apps/wjt/src/scripts/generate-blog-posts.ts
var import_fs4 = require("fs");
var import_path3 = require("path");

// libs/images/src/lib/convert.ts
var import_sharp = __toESM(require("sharp"));
var convertBufferToWebp = async (buffer) => {
  return await (0, import_sharp.default)(buffer, {}).webp().toBuffer();
};

// libs/images/src/lib/utils.ts
var import_fs = require("fs");
var getBufferFromPath = async (path) => {
  return (0, import_fs.readFileSync)(path);
};
var isCdnImage = (path, matcher) => {
  return matcher.test(path);
};

// apps/wjt/src/scripts/blog-post/blog-post.utils.ts
var import_pug = require("pug");
var import_commonmark = require("commonmark");
var import_process = require("process");
var import_path = require("path");
var import_fs2 = require("fs");

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
var parseRawPost = (rawPost) => {
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
var getStylesheet = () => (0, import_fs2.readFileSync)(getPath("src/views/styles/min.css"), "utf-8");
var styleTemplate = `<style>${getStylesheet()}</style>`;
var getRawPostFileNames = () => {
  return (0, import_fs2.readdirSync)(postsPath).filter((file) => file.endsWith(".md"));
};
var getRawBlogPost = (rawPostFileName) => {
  const rawPostPath = (0, import_path.join)(postsPath, rawPostFileName);
  return (0, import_fs2.readFileSync)(rawPostPath, "utf8");
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
var updateImageSources = (imageUpdates, post) => {
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
    this.parsedPost = parseRawPost(rawPost);
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
    const updatedPost = updateImageSources(imageUpdateMap, this.parsedPost);
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
    "![Image 1](./path/to/image-1.jpg)"
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
    "![CDN Image](https://wjt.sfo2.cdn.digitaloceanspaces.com/wjt_logo.ico)"
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

// apps/wjt/src/scripts/markdown-utils/markdown.utils.ts
var import_fs3 = require("fs");
var import_path2 = require("path");
var updateMarkdown = (targetFileName, parsedPost, imageUpdateMap) => {
  const frontmatter = generateFrontmatterString(parsedPost.frontMatter);
  const updatedPost = updateImageSources(imageUpdateMap, parsedPost);
  const finalPost = `${frontmatter}

${updatedPost.content}`;
  (0, import_fs3.writeFileSync)((0, import_path2.join)(postsPath, targetFileName), finalPost);
  return finalPost;
};
var generateFrontmatterString = (frontmatter) => {
  const frontmatterString = Object.entries(frontmatter).map(([key, value]) => `${key.trim()}: ${value}`).map((str) => `${str}`).join("\n");
  return `---
${frontmatterString}
---`;
};

// apps/wjt/src/scripts/generate-blog-posts.ts
var wjtSpacesClient2 = wjtSpacesClientFactory(wjtSpacesClientDefaultConfig);
var init = async () => {
  console.log("Generating blog posts \u{1F4DD}...\n\n");
  const rawPostFileNames = getRawPostFileNames();
  const processPosts = async () => {
    for (const rawPostFileName of rawPostFileNames) {
      const rawPost = getRawBlogPost(rawPostFileName);
      const blogPost = new BlogPost(rawPost);
      const targetPath = (0, import_path3.join)(
        postsPath,
        blogPost.parsedPost.frontMatter.slug + ".html"
      );
      try {
        await handleImageConversion(
          rawPostFileName,
          blogPost.postImages,
          blogPost
        );
      } catch (error) {
        console.error("Error handling image conversion:", error);
      } finally {
        (0, import_fs4.writeFileSync)(targetPath, blogPost.postMarkup);
      }
    }
  };
  processPosts().catch((error) => {
    console.error("Error processing posts:", error);
  });
};
var handleImageConversion = async (rawPostFileName, postImages, blogPost) => {
  const imageUpdates = [];
  for (const postImage of postImages) {
    if (isCdnImage(postImage.originalSrc, DEFAULT_CDN_MATCHER)) {
      console.log("Image is already on CDN. Skipping conversion...\n");
      continue;
    }
    console.log(`${postImage.originalSrc} is not on CDN.
`);
    console.log(`Converting ${postImage.originalSrc} to webp...
`);
    const targetPath = (0, import_path3.join)(postsPath, postImage.originalSrc);
    const targetImageName = `${postImage.originalSrc.split("/").pop().split(".")[0]}.webp`;
    try {
      const webPBuffer = await convertBufferToWebp(
        await getBufferFromPath(targetPath)
      );
      console.log(`Uploading ${targetImageName} to CDN...
`);
      const { cdnEndpointUrl } = await wjtSpacesClient2.putWebpObject({
        Body: webPBuffer,
        Key: targetImageName
      });
      console.log(`Uploaded ${targetImageName} to CDN.
`);
      console.log(`Updating imageUpdateMap with ${cdnEndpointUrl}...
`);
      imageUpdates.push({
        originalSrc: postImage.originalSrc,
        newSrc: cdnEndpointUrl
      });
    } catch (error) {
      console.error(`Error processing ${postImage.originalSrc}:`, error);
    }
  }
  if (imageUpdates.length > 0) {
    console.log("Updating image sources in post...\n");
    blogPost.updateImageSources(imageUpdates);
    console.log("Updating image sources in markdown file...\n");
    updateMarkdown(rawPostFileName, blogPost.parsedPost, imageUpdates);
  }
};
init();
