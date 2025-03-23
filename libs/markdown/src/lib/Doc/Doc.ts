import _path from 'path';
import fs from 'fs';

export abstract class Doc {
  readonly fileExtension: string;
  readonly path: string;
  readonly name: string;
  readonly value: Buffer;

  updatedValue: Buffer;
  logger: typeof console;

  constructor(filePath: string, logger: typeof console = console) {
    this.path = filePath;
    this.fileExtension = _path.extname(filePath);
    this.name = _path.basename(filePath, this.fileExtension);
    this.value = fs.readFileSync(filePath);
    this.logger = logger;
  }

  public abstract report(params?: unknown): Promise<void>;
  public abstract update(params: unknown): Promise<void>;

  /**
   * Writes the buffer to the file
   * @param {Buffer }buffer
   * @returns {Promise<void>}
   */
  protected write(buffer: Buffer): Promise<void> {
    fs.writeFileSync(this.path, buffer);
    return;
  }

  /**
   * Determines if the buffer has a value
   * @param {Buffer} buffer
   * @returns {boolean}
   */
  protected bufferHasValue(buffer: Buffer): boolean {
    return buffer?.length > 0;
  }

  /**
   * Returns the string value of the buffer
   * @returns {string}
   */
  public toString(): string {
    return this.value.toString();
  }
}
