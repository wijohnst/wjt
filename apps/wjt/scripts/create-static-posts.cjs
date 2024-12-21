// @ts-check

const c = require('commonmark');
const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, '..', 'src/posts');
const blogPosts = fs.readdirSync(postsPath);

const reader = new c.Parser();
const writer = new c.HtmlRenderer();

blogPosts.forEach((fileName) => {
    const filePath = path.join(postsPath, fileName);

    const parsed = reader.parse(fs.readFileSync(filePath, 'utf8'));

    const html = writer.render(parsed);

    fs.writeFileSync(filePath.replace('.md', '.html'), html);
    
})