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
  ImageUpdateMap,
} from '../blog-post';
import {
  wjtSpacesClientDefaultConfig,
  wjtSpacesClientFactory,
  DEFAULT_CDN_MATCHER,
} from '../wjt-spaces-client';
import { updateMarkdown } from '../markdown-utils';

const wjtSpacesClient = wjtSpacesClientFactory(wjtSpacesClientDefaultConfig);

/**
 * Generates blog posts by processing raw markdown files in the posts directory.
 */
export const init = async () => {
  console.log('📝 Generating blog posts...\n');

  try {
    await processPosts(getRawPostFileNames());
  } catch (error) {
    console.error('Error processing posts:', error);
  }
};

/**
 * Converts images and writes the blog post .html files to the posts directory
 * @param {string[]} rawPostFileNames
 */
export const processPosts = async (rawPostFileNames: string[]) => {
  for (const rawPostFileName of rawPostFileNames) {
    const rawPost = getRawBlogPost(rawPostFileName);
    const blogPost = new BlogPost(rawPost);
    const targetPath = join(
      postsPath,
      blogPost.parsedPost.frontMatter.slug + '.html'
    );

    await handleImageConversion(rawPostFileName, blogPost);

    writeFileSync(targetPath, blogPost.postMarkup);
  }
};

/**
 * For non-cdn images, converts images to webp and uploads to CDN
 * @param {string} rawPostFileName
 * @param {PostImage[]} postImages
 * @param {BlogPost} blogPost
 */
export const handleImageConversion = async (
  rawPostFileName: string,
  blogPost: BlogPost
) => {
  const imageUpdates: ImageUpdateMap[] = [];

  for (const postImage of blogPost.postImages) {
    if (isCdnImage(postImage.originalSrc, DEFAULT_CDN_MATCHER)) {
      console.log('✅ Image is already on CDN. Skipping conversion...\n');
      continue;
    }

    console.log(
      ` 🔁 ${postImage.originalSrc} is not on CDN. Converting to webp...\n`
    );

    const targetPath = join(postsPath, postImage.originalSrc);
    const targetImageName = `${
      postImage.originalSrc.split('/').pop().split('.')[0]
    }.webp`;

    try {
      const webPBuffer = await convertBufferToWebp(
        await getBufferFromPath(targetPath)
      );

      console.log(`🆙 Uploading ${targetImageName} to CDN...\n`);

      const { cdnEndpointUrl } = await wjtSpacesClient.putWebpObject({
        Body: webPBuffer,
        Key: targetImageName,
      });

      imageUpdates.push({
        originalSrc: postImage.originalSrc,
        newSrc: cdnEndpointUrl,
      });
    } catch (error) {
      console.error(`Error processing ${postImage.originalSrc}:`, error);
    }
  }

  if (imageUpdates.length > 0) {
    console.log('🧑‍💻 Updating image sources in post...\n');
    blogPost.updateImageSources(imageUpdates);
    console.log('📝 Updating image sources in markdown file...\n');
    updateMarkdown(rawPostFileName, blogPost.parsedPost, imageUpdates);
  }
};
