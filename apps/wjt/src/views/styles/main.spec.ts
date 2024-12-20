import fs from 'fs';
import path from 'path';

describe('main.css bundling check', () => {
  const filesToIgnore = ['main.css', 'min.css'];
  const mainCssPath = path.resolve(__dirname, 'main.css');
  const mainCss = fs.readFileSync(mainCssPath, 'utf8');
  const stylesDirPath = path.resolve(__dirname, '../styles');
  const files = fs.readdirSync(stylesDirPath);
  const styleFiles = files.filter(
    (file) => file.endsWith('.css') && !filesToIgnore.includes(file),
  );

  const importStatements = mainCss.match(/@import.*;/g);
  const fileNames = importStatements.map((statement) =>
    path.basename(statement.match(/['"](.*)['"]/)[1]),
  );

  test.each(styleFiles)('should have import statement for %s', (file) => {
    expect(fileNames).toContain(file);
  });
});
