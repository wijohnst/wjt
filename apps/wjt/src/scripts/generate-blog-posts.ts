import {
  BlogPost,
  getRawBlogPost,
  getRawPostFileNames,
  postsPath,
} from './blog-post';
import { writeFileSync } from 'fs';
import { join } from 'path';
import {
  WJT_SPACES_ENDPOINT,
  WJT_SPACES_REGION,
  wjtSpacesClientDefaultConfig,
  wjtSpacesClientFactory,
} from './wjt-spaces-client';

const wjtSpacesClient = wjtSpacesClientFactory(wjtSpacesClientDefaultConfig);

const init = async () => {
  console.log('Generating blog posts 📝...\n\n');
  const rawPostFileNames = getRawPostFileNames();
  const bucketContents = await wjtSpacesClient.getBucketContents();

  console.log('Bucket Contents:', bucketContents);

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
