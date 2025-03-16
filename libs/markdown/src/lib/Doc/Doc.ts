import _path from 'path';
import fs from 'fs';

export abstract class Doc {
  readonly fileExtension: string;
  readonly path: string;
  readonly name: string;
  readonly value: Buffer;

  updatedValue: Buffer;

  constructor(filePath: string) {
    this.path = filePath;
    this.fileExtension = _path.extname(filePath);
    this.name = _path.basename(filePath, this.fileExtension);
    this.value = fs.readFileSync(filePath);
  }
}
