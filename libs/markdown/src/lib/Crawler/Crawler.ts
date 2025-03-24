import fs from 'fs';

export type CrawlerConfig = {
  targetDir: string;
};

/**
 * Crawler - abstract class for crawling a directory
 */
export abstract class Crawler<T extends CrawlerConfig> {
  protected config: T;
  protected fs: typeof fs;

  public docs: string[] = [];

  constructor(config: T, _fs: typeof fs = fs) {
    this.config = config;
    this.fs = _fs;

    this.crawl();
  }

  abstract crawl(): void;
}
