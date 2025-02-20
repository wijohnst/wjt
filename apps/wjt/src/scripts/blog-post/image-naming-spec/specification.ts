import { Node as MarkdownNode, HtmlRenderer } from 'commonmark';

/*
1.1 - Syntax

Images should be valid markdown syntax for an image. 

See: [Commonmark Specification > 6.4 - Images](https://spec.commonmark.org/0.31.2/#images:~:text=bar%3C/a%3E%3C/p%3E-,6.4Images,-Syntax%20for%20images)
*/

/**
 * Checks if the given node is an image
 * @param {Node} node - CommonMark Node
 * @returns {boolean}
 */
export const isCommonmarkImage = (node: MarkdownNode): boolean => {
  return node.type === 'image';
};

/*
### 1.2 - Image Descriptor Format - bang-brace-param

CommonMark includes many valid formats for configuring an Image Descriptor. For this specification we will only consider the `![]()` (read: "bang-brace-param" ) flavor as valid:

#### !`[]()` Syntax

```markdown
# bang-brace-param.md
![$<ALT_TEXT$HEIGHTxWIDTH>]($<URL>)

# bang-brace-param.html
<p><img src="/$<URL>" alt="$<ALT-TEXT>" /></p>
```
*/

const bangBraceParam = /!\[(.+?)\]\((.*?)\)/;

/**
 * Checks if the given markdown string is in the bang-brace-param format
 * @param {string} markdownString
 * @returns {boolean}
 */
export const isBangBraceParam = (markdownString: string): boolean => {
  return bangBraceParam.test(markdownString);
};

/**
### 2.1 Meta Text

The `$<META-TEXT>`  value is used to encode metadata. The encoding is comprised of two distinct sub-strings:

- Alt Text
 -- Underscore delineated substring
- Original Image Dimensions
  -- Height and Width separated by an `x` character

Example:
ALT_TEXT$HEIGHTxWIDTH // valid

Example:
ALT TEXT$HEIGHTxWIDTH // invalid, has whitespace

Example:
ALT_TEXT$HEIGHTWIDTH // invalid, missing `x` character

Example:
ALT-TEXT$HEIGHTxWIDTH // invalid, has special character
 */
const metaTextRegex = /^([a-zA-Z_]+)\$(\d+)x(\d+)$/;

export const isAltText = (text: string): boolean => {
  return metaTextRegex.test(text);
};

/**
 ### 3.1 URL

The `URL` substring points to either a local or remote resource and is used to populate the `<img />`element's `src` attribute:

```markdown
// input.md
![some_alt_text$200x200](example.jpg)

// output.html
<img alt="some alt text" src="example.jpg" />
```

### 3.2 Valid File Extensions

All URL's should point to a resource with one of three valid mime types:

- `image/jpeg`
- `image/png`
- `image/svg+xml`

```markdown
// valid.md
![some_alt_text$200x200](example.jpg)
![some_alt_text$200x200](example.png)
![some_alt_text$200x200](example.svg)


// invalid.md
![some_alt_text$200x200](example.webp)
```
 */
const validFileExtensions = /\.(jpg|jpeg|png|svg)$/;
export const isValidFileExtension = (url: string): boolean => {
  return validFileExtensions.test(url);
};

type MetaText = {
  altText: string;
  height: number;
  width: number;
};

type ImageData = {
  metaText: MetaText;
  url: string;
};
/**
 * Parses meta text from a markdown string with bang-brace-param syntax
 * @param {string} markdownString
 * @returns {string} - meta text
 */
export const parseMarkdownImage = (markdownString: string): ImageData => {
  const match = bangBraceParam.exec(markdownString);

  if (match) {
    return {
      metaText: parseMetaText(match[1]),
      url: match[2],
    };
  }

  throw new Error('Image naming syntax error - could not parse meta text');
};

/**
 *
 * @param {string} target
 * @returns
 */
export const parseMetaText = (target: string): MetaText => {
  const match = metaTextRegex.exec(target);

  if (match) {
    return {
      altText: match[1],
      height: parseInt(match[2]),
      width: parseInt(match[3]),
    };
  }

  throw new Error('Image naming syntax error - could not parse meta text');
};

// regex that matches characters inside of `[]` but not the brackets themselves
const altTextRegex = /(?<=\[)[^\]]+(?=\])/;

// regex that matches characters inside of `()` but not the brackets themselves
const urlRegex = /(?<=\()[^\)]+(?=\))/;

/**
 * Tests the given markdown string for valid image syntax
 * @param {string} markdownString
 * @returns {boolean}
 */
export const isValidImageSyntax = (markdownString: string): boolean => {
  const [altText = ''] = altTextRegex.exec(markdownString) ?? [];
  const [url = ''] = urlRegex.exec(markdownString) ?? [];
  const tests = [
    [isBangBraceParam(markdownString), 'bang-brace-param error'],
    [isAltText(altText), 'Invalid Meta Text'],
    [isValidFileExtension(url), 'Invalid File Extension'],
  ];

  return tests.every(([test, errorMessage]) => {
    if (test) {
      return true;
    } else {
      throw new Error(`Invalid Image Syntax: ${errorMessage}`);
    }
  });
};
