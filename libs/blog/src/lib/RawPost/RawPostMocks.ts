const rawPostLocal = `---
title: My Example Post
author: Will Johnston
slug: example-post
---

# Example Post

This is a local post. That means it's images are stored in the local filesystem and have not been uploaded to the CDN.

![Sample Image](./local/sample-image.png)

`;

export const RawPostMocks = {
  LOCAL: rawPostLocal,
};

export const RawPostPaths = {
  LOCAL: '/posts/local-post.md',
};

export const MockRawPostFileSystem = {
  [RawPostPaths.LOCAL]: RawPostMocks.LOCAL,
};
