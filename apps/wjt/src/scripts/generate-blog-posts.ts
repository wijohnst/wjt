import { writeFileSync } from 'fs';
import { join } from 'path';
import {
  isCdnImage,
  getBufferFromPath,
  convertBufferToWebp,
} from '@wjt/images';
import {
  BlogPost,
  getRawBlogPost,
  getRawPostFileNames,
  postsPath,
  PostImage,
  ImageUpdateMap,
} from './blog-post';
import {
  wjtSpacesClientDefaultConfig,
  wjtSpacesClientFactory,
  DEFAULT_CDN_MATCHER,
} from './wjt-spaces-client';
import { updateMarkdown } from './markdown-utils';

const wjtSpacesClient = wjtSpacesClientFactory(wjtSpacesClientDefaultConfig);

const init = async () => {
  console.log('Generating blog posts 📝...\n\n');

  const rawPostFileNames = getRawPostFileNames();

  const processPosts = async () => {
    for (const rawPostFileName of rawPostFileNames) {
      const rawPost = getRawBlogPost(rawPostFileName);
      const blogPost = new BlogPost(rawPost);
      const targetPath = join(
        postsPath,
        blogPost.parsedPost.frontMatter.slug + '.html'
      );

      try {
        await handleImageConversion(
          rawPostFileName,
          blogPost.postImages,
          blogPost
        );
      } catch (error) {
        console.error('Error handling image conversion:', error);
      } finally {
        writeFileSync(targetPath, blogPost.postMarkup);
      }
    }
  };

  processPosts().catch((error) => {
    console.error('Error processing posts:', error);
  });
};

const handleImageConversion = async (
  rawPostFileName: string,
  postImages: PostImage[],
  blogPost: BlogPost
) => {
  const imageUpdates: ImageUpdateMap[] = [];

  for (const postImage of postImages) {
    if (isCdnImage(postImage.originalSrc, DEFAULT_CDN_MATCHER)) {
      console.log('Image is already on CDN. Skipping conversion...\n');
      continue;
    }

    console.log(`${postImage.originalSrc} is not on CDN.\n`);
    console.log(`Converting ${postImage.originalSrc} to webp...\n`);
    const targetPath = join(postsPath, postImage.originalSrc);
    const targetImageName = `${
      postImage.originalSrc.split('/').pop().split('.')[0]
    }.webp`;

    try {
      const webPBuffer = await convertBufferToWebp(
        await getBufferFromPath(targetPath)
      );
      console.log(`Uploading ${targetImageName} to CDN...\n`);
      const { cdnEndpointUrl } = await wjtSpacesClient.putWebpObject({
        Body: webPBuffer,
        Key: targetImageName,
      });

      console.log(`Uploaded ${targetImageName} to CDN.\n`);
      console.log(`Updating imageUpdateMap with ${cdnEndpointUrl}...\n`);

      imageUpdates.push({
        originalSrc: postImage.originalSrc,
        newSrc: cdnEndpointUrl,
      });
    } catch (error) {
      console.error(`Error processing ${postImage.originalSrc}:`, error);
    }
  }

  if (imageUpdates.length > 0) {
    console.log('Updating image sources in post...\n');
    blogPost.updateImageSources(imageUpdates);
    console.log('Updating image sources in markdown file...\n');
    updateMarkdown(rawPostFileName, blogPost.parsedPost, imageUpdates);
  }
};

init();
