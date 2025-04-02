import { Markdown, CommonmarkNode } from '@wjt/markdown';

export class RawPost extends Markdown {
  readonly imageNodes: CommonmarkNode[] = [];
  readonly originalContent: string;

  private readonly frontmatterMatcher = /---([\s\S]*?)---/;
  private updatedContent: string;

  constructor(filePath: string, logger: typeof console = console) {
    super(filePath, logger);

    this.imageNodes = this.getNodesByType('image');
    this.originalContent = this.value.toString();
  }

  /**
   * Returns the frontmatter of the post
   * @returns {string}
   */
  get rawFrontMatter(): string {
    const content = this.updatedContent || this.originalContent;
    const [frontMatter] = content.match(this.frontmatterMatcher);

    return frontMatter;
  }
}
