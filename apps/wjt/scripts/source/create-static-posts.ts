import {
  getFiles,
  parseRawPosts,
  getRenderedPost,
  postsPath,
} from './static-posts';

import { join, dirname } from 'path';

import { writeFileSync, mkdirSync } from 'fs';

const init = () => {
  const fileNames = getFiles();

  parseRawPosts().forEach((post, index) => {
    const fileName = fileNames[index];
    const filePath = join('apps/wjt', postsPath, fileName);
    console.log('filePath', filePath);
    const renderedPost = getRenderedPost(post);

    console.log(renderedPost);

    // mkdirSync(dirname(filePath), { recursive: true });

    writeFileSync(filePath.replace('.md', '.html'), renderedPost);
  });
};

init();
