import {
  getFiles,
  parseRawPosts,
  getRenderedPost,
  postsPath,
} from './static-posts';

import { join } from 'path';

import { writeFileSync } from 'fs';

const init = () => {
  const fileNames = getFiles();

  parseRawPosts().forEach((post, index) => {
    const fileName = fileNames[index];
    const filePath = join('apps/wjt', postsPath, fileName);
    const renderedPost = getRenderedPost(post);

    writeFileSync(filePath.replace('.md', '.html'), renderedPost);
  });
};

init();
