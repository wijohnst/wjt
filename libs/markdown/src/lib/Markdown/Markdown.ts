import { Doc as Document } from '../Doc';

import { Parser, Node as CommonmarkNode } from 'commonmark';

type MarkdownUpdateParams = {
  matcher: RegExp;
  replacement: string;
};

export class Markdown extends Document {
  private parser: Parser;
  public AST: CommonmarkNode;

  constructor(
    filePath: string,
    logger: typeof console = console,
    parser: Parser = new Parser()
  ) {
    super(filePath, logger);

    this.parser = parser;
  }

  /**
   * Accepts a matcher and a replacement value and writes the updated value to the file
   * @param {MarkdownUpdateParams} { matcher, replacement }
   * @returns {Promise<void>}
   */
  public async update({
    matcher,
    replacement,
  }: MarkdownUpdateParams): Promise<void> {
    const updatedValue = this.value.toString().replace(matcher, replacement);

    if (updatedValue === this.value.toString()) {
      throw new Error(
        `Error updating ${this.path}. No matches found using matcher: ${matcher}`
      );
    }

    this.updatedValue = Buffer.from(updatedValue);
    this.write(this.updatedValue);
  }

  /**
   * Logs the current value of the target markdown document
   * @returns {Promise<void>}
   */
  public async report(): Promise<void> {
    const isUpdated = this.bufferHasValue(this.updatedValue);

    if (isUpdated) {
      this.logger.log(this.updatedValue.toString());
      return;
    }

    this.logger.log(this.value.toString());
  }

  /**
   * Parses the markdown document into an AST
   */
  public parse(): void {
    const input = this.toString();

    this.AST = this.parser.parse(input);
  }

  /**
   * Returns the string representation of the markdown document with the latest values
   * @returns {string}
   */
  override toString(): string {
    if (this.hasUpdatedValue()) {
      return this.updatedValue.toString();
    }

    return this.value.toString();
  }

  private hasUpdatedValue(): boolean {
    return this.bufferHasValue(this.updatedValue);
  }
}
