"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRenderedPost = exports.getFrontmatter = exports.parseRawPosts = exports.getRawPosts = exports.getMarkdownFiles = exports.getPath = exports.postsPath = void 0;
var fs_1 = require("fs");
var commonmark_1 = require("commonmark");
var pug_1 = require("pug");
var process_1 = require("process");
var path_1 = require("path");
var frontmatterRegex = /---([\s\S]*?)---/g;
var frontmatterDelimiterRegex = /---/g;
var newlineRegex = /\n/g;
var styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
var defaultFrontMatter = {
    title: '',
    author: '',
    slug: '',
};
exports.postsPath = 'src/posts';
/**
 * Wraps relative paths with the current working directory and returns the full path
 * @param {string} subpath
 * @returns {string}
 */
var getPath = function (subpath) {
    if (process.env.NODE_ENV === 'test') {
        return subpath;
    }
    return (0, path_1.join)((0, process_1.cwd)(), "apps/wjt/".concat(subpath));
};
exports.getPath = getPath;
/**
 * Returns the minified default stylesheet for the application
 * @returns {string} The contents of the minified stylesheet
 */
var getStylesheet = function () {
    return (0, fs_1.readFileSync)((0, exports.getPath)('src/views/styles/min.css'), 'utf-8');
};
var styleTemplate = "<style>".concat(getStylesheet(), "</style>");
/**
 * Returns an array of markdown filename strings in the `src/posts` directory
 * @returns {string[]} An array of file names in the `src/posts` directory
 */
var getMarkdownFiles = function () {
    return (0, fs_1.readdirSync)((0, exports.getPath)(exports.postsPath)).filter(function (file) { return file.endsWith('.md'); });
};
exports.getMarkdownFiles = getMarkdownFiles;
/**
 * Returns the markdown content of all posts in the `src/posts` directory
 * @returns {Post[]} An array of raw post content, including frontmatter
 */
var getRawPosts = function () {
    var files = (0, exports.getMarkdownFiles)();
    return files.map(function (file) {
        var fileData = (0, fs_1.readFileSync)((0, exports.getPath)("".concat(exports.postsPath, "/").concat(file)), 'utf-8');
        return fileData;
    });
};
exports.getRawPosts = getRawPosts;
/**
 * Returns an array of parsed post objects
 * @returns {Post[]}
 */
var parseRawPosts = function () {
    var rawPosts = (0, exports.getRawPosts)();
    return rawPosts.map(function (rawPost) { return ({
        frontMatter: (0, exports.getFrontmatter)(rawPost),
        content: rawPost === null || rawPost === void 0 ? void 0 : rawPost.replace(frontmatterRegex, '').trim(),
    }); });
};
exports.parseRawPosts = parseRawPosts;
/**
 * Returns the frontmatter of a post
 * @param {RawPost }rawPost
 * @returns {DefaultFrontMatterData}
 */
var getFrontmatter = function (rawPost) {
    var _a;
    var rawFrontmatter = (_a = rawPost
        .match(frontmatterRegex)) === null || _a === void 0 ? void 0 : _a[0].replace(frontmatterDelimiterRegex, '').trim();
    if (!rawFrontmatter) {
        throw new Error("Frontmatter is missing in the post: ".concat(rawPost));
    }
    var requiredFields = Object.keys(defaultFrontMatter);
    var parsedFrontmatter = rawFrontmatter
        .split(newlineRegex)
        .reduce(function (acc, line) {
        var _a;
        var _b = line.split(':').map(function (str) { return str.trim(); }), key = _b[0], value = _b[1];
        return __assign(__assign({}, acc), (_a = {}, _a[key] = value, _a));
    }, defaultFrontMatter);
    requiredFields.forEach(function (field) {
        if (!parsedFrontmatter[field]) {
            throw new Error("Missing required frontmatter field: ".concat(field, " in post: ").concat(rawPost));
        }
    });
    return parsedFrontmatter;
};
exports.getFrontmatter = getFrontmatter;
/**
 * Accepts a post object and returns the rendered post as a UTF-8 string. This string can be written to an HTML file and server to the client.
 * @param {Post} post
 * @returns {string} The rendered post
 */
var getRenderedPost = function (post) {
    var frontMatter = post.frontMatter, content = post.content;
    var headTemplate = (0, pug_1.compileFile)((0, exports.getPath)('src/views/templates/head.pug'))({
        title: frontMatter.title,
    }).replace(styleRegex, '');
    var parsedContent = new commonmark_1.Parser().parse(content);
    var writer = new commonmark_1.HtmlRenderer();
    var html = writer.render(parsedContent);
    var withWrapper = "<div class=\"post\">".concat(html, "</div>");
    var finalRender = ''.concat(headTemplate, styleTemplate, withWrapper);
    return finalRender;
};
exports.getRenderedPost = getRenderedPost;
