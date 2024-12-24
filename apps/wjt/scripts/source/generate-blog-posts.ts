import { BlogPost, RawPost } from './blog-post';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const postsPath = process.env.POSTS_PATH || 'src/posts';

/**
 * Returns the markdown file names in the posts directory
 * @returns {string[]}
 */
export const getRawPostFileNames = (): string[] => {
  return readdirSync(postsPath).filter((file) => file.endsWith('.md'));
};

export const getRawBlogPost = (rawPostFileName: string): RawPost => {
  const rawPostPath = join(postsPath, rawPostFileName);
  return readFileSync(rawPostPath, 'utf8');
};

const init = () => {
  console.log('Generating blog posts 📝...\n\n');

  const rawPostFileNames = getRawPostFileNames();

  rawPostFileNames.forEach((rawPostFileName) => {
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