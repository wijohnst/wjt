import { Doc as Document } from '../Doc';

type MarkdownUpdateParams = {
  matcher: RegExp;
  replacement: string;
};
export class Markdown extends Document {
  constructor(filePath: string) {
    super(filePath);
  }

  public async update({
    matcher,
    replacement,
  }: MarkdownUpdateParams): Promise<void> {
    const updatedValue = this.value.toString().replace(matcher, replacement);

    if (updatedValue === this.value.toString()) {
      throw new Error(
        `Error updating ${this.path}. No matches found using matched: ${matcher}`
      );
    }

    this.updatedValue = Buffer.from(updatedValue);
    this.write(this.updatedValue);
  }
}
