export const MarkdownPostBasePath = '/path/to/';

export const MARKDOWN_DOC_WITH_IMAGES = `# Heading 1 \n\n![alt text](image.jpg)`;

export const MockMarkdownFilesPaths = {
  FILE: `${MarkdownPostBasePath}file.md`,
  UPDATE: `${MarkdownPostBasePath}update.md`,
  REPORT: `${MarkdownPostBasePath}report.md`,
  IMAGE_DOC: `${MarkdownPostBasePath}image-doc.md`,
  IMAGE: `${MarkdownPostBasePath}image.jpg`,
};

export const MockMarkdownFileSystem = {
  [MockMarkdownFilesPaths.FILE]: 'file content',
  [MockMarkdownFilesPaths.UPDATE]: 'update me',
  [MockMarkdownFilesPaths.REPORT]: 'report me',
  [MockMarkdownFilesPaths.IMAGE_DOC]: MARKDOWN_DOC_WITH_IMAGES,
  [MockMarkdownFilesPaths.IMAGE]: Buffer.from('image content'),
};
