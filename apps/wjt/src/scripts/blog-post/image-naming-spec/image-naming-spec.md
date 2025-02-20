# Blog Image Naming Specification

## Describes how blog image names should be generated and validated

---

## Sample

```typescript
// example-post.md
![Sample_Image$400x600](sample-image-400-600.jpg|svg|png)
```

### 1.1 - Syntax

Images should be valid markdown syntax for an image.

See: [Commonmark Specificaiton > 6.4 - Images](https://spec.commonmark.org/0.31.2/#images:~:text=bar%3C/a%3E%3C/p%3E-,6.4Images,-Syntax%20for%20images)

### 1.2 - Image Descriptor Format - bang-brace-param

[CommonMark](craftdocs://open?blockId=42FA5B17-0E6C-4F2C-9EF7-A21F9D1D6108&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) includes many valid formats for configuring an Image Descriptor. For this specification we will only consider the `![]()` (read: "bang-brace-param" ) flavor (see [example 578](https://spec.commonmark.org/0.31.2/#example-578)) as valid:

#### !`[]()` Syntax

```markdown
// bang-brace-param.md
![$<ALT_TEXT$HEIGHTxWIDTH>]($<URL>)

// bang-brace-param.html
<p><img src="/$<URL>" alt="$<ALT-TEXT>" /></p>
```

### 2.1 Meta Text

The `$<META-TEXT>`  value is used to encode metadata. The encoding is comprised of two distinct sub-strings:

   1. [Alt Text](craftdocs://open?blockId=9CE354A2-313C-467E-92D3-8D677AB8DE5D&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46)
   2. [Original Image Dimensions](craftdocs://open?blockId=62E9C7EE-E1D1-4B34-9865-940B811ED266&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46)

### 2.1.1 Meta Text - Validation

[2.1 Meta Text](craftdocs://open?blockId=F8B57434-3900-45F2-B262-D7557F6DD98D&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) is considered valid if it contains:

   1. Exactly one valid [Alt Text](craftdocs://open?blockId=9CE354A2-313C-467E-92D3-8D677AB8DE5D&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) substring
   2. Exactly one valid [Original Image Dimensions](craftdocs://open?blockId=62E9C7EE-E1D1-4B34-9865-940B811ED266&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) substring

### 2.2 Alt Text

The first [Meta Text](craftdocs://open?blockId=F8B57434-3900-45F2-B262-D7557F6DD98D&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) substring is the alt text value that will be renderer as the `alt` attribute for the output [`<img />`](craftdocs://open?blockId=12097E70-D5E7-41DC-8EA6-04C2796F24BE&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) element. The substring is made up of any valid ASCII character and is delineated by an underscore (`_` ) character.

```markdown
// input.md
![some_alt_text$200x200](example.jpg)

// output.html
<img alt="some alt text" src="example.jpg" />
```

### 2.2.1 Alt Text Validation

An [Alt Text](craftdocs://open?blockId=9CE354A2-313C-467E-92D3-8D677AB8DE5D&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) substring is considered valid when:

   1. It contains only ASCII character `A-Z || a-z`  in any combination
   2. It contains zero or more `_` (underscore) characters
   3. The substring is not terminated with an `_` (underscore) character

### 2.3 Original Image Dimensions

The second [Meta Text](craftdocs://open?blockId=F8B57434-3900-45F2-B262-D7557F6DD98D&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) substring represents the original height and width dimensions of the image references in the [URL](craftdocs://open?blockId=39815AFB-2C94-446F-B288-5EE53572FF91&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46). The string is delineated by a `$` character (dollar) and must not immediately follow a `_` character (underscore).

```markdown
// valid.md
![alt_text$200x200](example.jpg)

// invalid.md
![alt_text_$200x200](example.jpg) // Unclear where alt text ends and dimensions begins
```

### 2.3.1 Original Image Dimensions Validation

An [Original Image Dimensions](craftdocs://open?blockId=62E9C7EE-E1D1-4B34-9865-940B811ED266&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) substring is considered valid when:

   1. It contains any initial substring of no more than 4 ASCII characters, `0-9` ,in any combination
   2. It contains exactly one `x` character
   3. It terminates with a substring of no more than 4 ASCII character, `0-9` ,in any combination

### 3.1 URL

The `URL` substring points to either a local or remote resource and is used to populate the [`<img />`](craftdocs://open?blockId=12097E70-D5E7-41DC-8EA6-04C2796F24BE&spaceId=35b7910a-02c9-b6ae-7bc0-106a5eab9e46) element's `src` attribute:

```markdown
// input.md
![some_alt_text$200x200](example.jpg)

// output.html
<img alt="some alt text" src="example.jpg" />
```

The substring should be a valid URL as defined by the [URL living specification](https://url.spec.whatwg.org/).

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
