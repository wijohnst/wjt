// @ts-check

const c = require('commonmark');
const fs = require('fs');
const path = require('path');
const pug = require('pug');

const head= pug.compileFile(path.join(__dirname, '..', 'src/views/templates/head.pug'));

const postsPath = path.join(__dirname, '..', 'src/posts');
const blogPosts = fs.readdirSync(postsPath);

const reader = new c.Parser();
const writer = new c.HtmlRenderer();

const styleTemplate = `
<link rel="stylesheet" href="min.css">
`

const extractFrontMatter = (path) => {
  const file = fs.readFileSync(path, 'utf8');
    const frontMatterRaw = file.match(/---([\s\S]*?)---/)?.[1] ;

    if (!frontMatterRaw) {
        return {
            frontMatter: {},
            content: file
        }
    }
    const content = file.replace(frontMatterRaw, '').replace(/---/g,'').trim();

   return {
         frontMatter : parseFrontMatter(frontMatterRaw),
         content
   }
}

const parseFrontMatter = (frontMatter) => {
    const lines = frontMatter.split('\n');
    const parsed = {};

    lines.forEach((line) => {
        const [key, value] = line.split(':').map((s) => s.trim());
        if(!key || !value) {
            return;
        }
        parsed[key] = value;
    });

    return parsed;
}

blogPosts.forEach((fileName) => {
    const filePath = path.join(postsPath, fileName);
    const { frontMatter, content} = extractFrontMatter(filePath);
    const parsed = reader.parse(content);
    const html = writer.render(parsed);
    const headTemplate = head({ title: `wjt blog - ${frontMatter.title ?? ''}`});
    const finalRender = ''.concat(headTemplate,html); 

    fs.writeFileSync(filePath.replace('.md', '.html'), finalRender);
})

