// apps/wjt/src/scripts/blog-post/blog-post.utils.ts
var import_pug = require("pug");
var import_commonmark = require("commonmark");
var import_process = require("process");
var import_path = require("path");
var import_fs = require("fs");

// apps/wjt/src/scripts/wjt-spaces-client/wjt-spaces-client.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var WJT_SPACES_BUCKET_ID = `wjt`;
var WJT_SPACES_ENDPOINT = `https://sfo2.digitaloceanspaces.com`;
var WJT_SPACES_REGION = `sfo2`;
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
  slug: ""
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
var listBucketContent = async () => {
  return await wjtSpacesClient.getBucketContents();
};
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
  const openTag = "<html>";
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
  let imageNodesSet = /* @__PURE__ */ new Set();
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
  async listBucketContents() {
    await listBucketContent();
  }
};

// apps/wjt/src/scripts/blog-post/blog-post.mocks.ts
var rawPosts = [
  [
    "---",
    "title: Post 1",
    "author: Some Author",
    "slug: post-1",
    "---",
    "# Post 1\n",
    "This is the first post.",
    "![Image 1](/path/to/image-1.jpg)"
  ],
  [
    "---",
    "title: Post 2",
    "author: Another Author",
    "slug: post-2",
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
  getMockPostContent(rawPosts[0].slice(0, 5)),
  getMockPostContent(rawPosts[1].slice(0, 5)),
  getMockPostContent(rawPosts[2].slice(0, 4))
];
var rawContentMocks = [
  getMockPostContent(rawPosts[0].slice(5)),
  getMockPostContent(rawPosts[1].slice(5)),
  getMockPostContent(rawPosts[2].slice(4))
];

// apps/wjt/src/scripts/generate-blog-posts.ts
var import_fs2 = require("fs");
var import_path2 = require("path");
var wjtSpacesClient2 = wjtSpacesClientFactory(wjtSpacesClientDefaultConfig);
var init = async () => {
  console.log("Generating blog posts \u{1F4DD}...\n\n");
  const rawPostFileNames = getRawPostFileNames();
  const bucketContents = await wjtSpacesClient2.getBucketContents();
  console.log("Bucket Contents:", bucketContents);
  rawPostFileNames.forEach(async (rawPostFileName) => {
    const rawPost = getRawBlogPost(rawPostFileName);
    const blogPost = new BlogPost(rawPost);
    const targetPath = (0, import_path2.join)(
      postsPath,
      blogPost.parsedPost.frontMatter.slug + ".html"
    );
    console.log(`Writing blog post markup to ${targetPath}...
`);
    (0, import_fs2.writeFileSync)(targetPath, blogPost.postMarkup);
  });
};
init();
