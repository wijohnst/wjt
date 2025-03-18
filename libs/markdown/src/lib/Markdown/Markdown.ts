import { Doc as Document } from '../Doc';

type MarkdownUpdateParams = {
  matcher: RegExp;
  replacement: string;
};
export class Markdown extends Document {
  constructor(filePath: string, logger: typeof console = console) {
    super(filePath, logger);
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
}
