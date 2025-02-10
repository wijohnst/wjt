import { HtmlRenderer, Parser } from 'commonmark';
import { BlogPostRenderer } from './BlogPostRenderer';

const normalizeWhitespace = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

describe('BlogPostRenderer', () => {
  test('should be defined', () => {
    expect(BlogPostRenderer).toBeDefined();
  });

  let sut: BlogPostRenderer;

  beforeEach(() => {
    sut = new BlogPostRenderer();
  });

  test('should be an instance of HtmlRenderer', () => {
    expect(sut).toBeInstanceOf(HtmlRenderer);
  });

  test('should have an image method that renders a picture tag', () => {
    const content = `# Hello World\n\n![alt text](https://example.com/image.jpg)`;

    const parsed = new Parser().parse(content);
    const rendered = sut.render(parsed);

    expect(normalizeWhitespace(rendered)).toBe(
      normalizeWhitespace(
        '<h1>Hello World</h1>\n<p><picture> <source srcset="https://example.com/image.webp" type="image/webp"> <img src="https://example.com/image.jpg" alt="alt text" /></picture></p>\n'
      )
    );
  });

  test('should not render a picture tag for unsafe protocols', () => {
    const sut = new BlogPostRenderer({
      safe: true,
    });
    const content = `# Hello World\n\n![alt text](javascript:alert('hello'))`;

    const parsed = new Parser().parse(content);
    const rendered = sut.render(parsed);

    expect(normalizeWhitespace(rendered)).toBe(
      normalizeWhitespace(
        '<h1>Hello World</h1>\n<p><picture><img src="" alt="alt text" /></picture></p>\n'
      )
    );
  });
});
