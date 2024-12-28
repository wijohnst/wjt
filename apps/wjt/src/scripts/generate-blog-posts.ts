import {
  BlogPost,
  getRawBlogPost,
  getRawPostFileNames,
  postsPath,
} from './blog-post';
import { writeFileSync } from 'fs';
import { join } from 'path';

const init = async () => {
  console.log('Generating blog posts 📝...\n\n');
  let bucketContents = [];

  const rawPostFileNames = getRawPostFileNames();

  rawPostFileNames.forEach(async (rawPostFileName) => {
    const rawPost = getRawBlogPost(rawPostFileName);
    const blogPost = new BlogPost(rawPost);
    const targetPath = join(
      postsPath,
      blogPost.parsedPost.frontMatter.slug + '.html'
    );

    console.log(`Writing blog post markup to ${targetPath}...\n`);

    writeFileSync(targetPath, blogPost.postMarkup);
  });
};

init();
