export const MD_BASE_PATH = '/path/to/';

export const MARKDOWN_DOC_WITH_IMAGES = `# Heading 1 \n\n![alt text](image.jpg)`;

export const MockMarkdownFileNames = {
  FILE: 'file.md',
  UPDATE: 'update.md',
  REPORT: 'report.md',
  IMAGE_DOC: 'image-doc.md',
};

export const MockMarkdownFileList = Object.values(MockMarkdownFileNames);

export const OtherFileNames = {
  IMAGE: 'image.jpg',
};

export const MockMarkdownFilesPaths = {
  FILE: `${MD_BASE_PATH}${MockMarkdownFileNames.FILE}`,
  UPDATE: `${MD_BASE_PATH}${MockMarkdownFileNames.UPDATE}`,
  REPORT: `${MD_BASE_PATH}${MockMarkdownFileNames.REPORT}`,
  IMAGE_DOC: `${MD_BASE_PATH}${MockMarkdownFileNames.IMAGE_DOC}`,
  IMAGE: `${MD_BASE_PATH}${OtherFileNames.IMAGE}`,
};

export const MockMarkdownFileContents = {
  FILE: 'file content',
  UPDATE: 'update me',
  REPORT: 'report me',
  IMAGE_DOC: MARKDOWN_DOC_WITH_IMAGES,
  IMAGE: Buffer.from('image content'),
};

export const MockMarkdownFileSystem = {
  [MockMarkdownFilesPaths.FILE]: MockMarkdownFileContents.FILE,
  [MockMarkdownFilesPaths.UPDATE]: MockMarkdownFileContents.UPDATE,
  [MockMarkdownFilesPaths.REPORT]: MockMarkdownFileContents.REPORT,
  [MockMarkdownFilesPaths.IMAGE_DOC]: MockMarkdownFileContents.IMAGE_DOC,
  [MockMarkdownFilesPaths.IMAGE]: MockMarkdownFileContents.IMAGE,
};

export const NestedMockMarkdownFileSystem = {
  ...MockMarkdownFileSystem,
  [`${MD_BASE_PATH}nested/`]: {
    'nested-file.md': 'nested file content',
  },
};
