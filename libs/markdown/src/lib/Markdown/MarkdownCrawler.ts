import { Crawler, CrawlerConfig } from '../Crawler';

export type MarkdownCrawlerConfig = CrawlerConfig & {
  targetDir: string;
};

/**
 * MarkdownCrawler - class for crawling a directory for markdown files
 */
export class MarkdownCrawler extends Crawler<MarkdownCrawlerConfig> {
  private readonly targetFileExtension = '.md';

  constructor(config: MarkdownCrawlerConfig) {
    super(config);
  }

  crawl(): void {
    this.docs = this.fs
      .readdirSync(this.config.targetDir)
      .filter((file) => file.endsWith(this.targetFileExtension));
  }
}
