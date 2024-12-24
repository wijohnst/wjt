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
exports.getPath = exports.renderPost = exports.getFrontmatter = exports.parseRawPost = exports.requiredFields = exports.defaultFrontMatter = exports.styleRegex = exports.newlineRegex = exports.frontmatterDelimiterRegex = exports.frontmatterRegex = void 0;
var pug_1 = require("pug");
var commonmark_1 = require("commonmark");
var process_1 = require("process");
var path_1 = require("path");
var fs_1 = require("fs");
exports.frontmatterRegex = /---([\s\S]*?)---/g;
exports.frontmatterDelimiterRegex = /---/g;
exports.newlineRegex = /\n/g;
exports.styleRegex = /<link rel="stylesheet" href="min.css"\/>/g;
exports.defaultFrontMatter = {
    title: '',
    author: '',
    slug: '',
};
exports.requiredFields = Object.keys(exports.defaultFrontMatter);
/**
 * Returns an array of parsed post objects
 * @returns {Post[]}
 */
var parseRawPost = function (rawPost) {
    return {
        frontMatter: (0, exports.getFrontmatter)(rawPost),
        content: rawPost === null || rawPost === void 0 ? void 0 : rawPost.replace(exports.frontmatterRegex, '').trim(),
    };
};
exports.parseRawPost = parseRawPost;
/**
 * Returns the frontmatter of a post or throws if any required fields are missing
 * @param {RawPost }rawPost
 * @returns {DefaultFrontMatter}
 */
var getFrontmatter = function (rawPost) {
    var _a;
    var rawFrontmatter = (_a = rawPost
        .match(exports.frontmatterRegex)) === null || _a === void 0 ? void 0 : _a[0].replace(exports.frontmatterDelimiterRegex, '').trim();
    if (!rawFrontmatter) {
        throw new Error("Frontmatter is missing in the post: ".concat(rawPost));
    }
    var parsedFrontmatter = rawFrontmatter
        .split(exports.newlineRegex)
        .reduce(function (acc, line) {
        var _a;
        var _b = line.split(':').map(function (str) { return str.trim(); }), key = _b[0], value = _b[1];
        return __assign(__assign({}, acc), (_a = {}, _a[key] = value, _a));
    }, exports.defaultFrontMatter);
    exports.requiredFields.forEach(function (field) {
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
var renderPost = function (post) {
    var frontMatter = post.frontMatter, content = post.content;
    var headTemplate = (0, pug_1.renderFile)((0, exports.getPath)('src/views/templates/head.pug'), {
        title: frontMatter.title.trim(),
    }).replace(exports.styleRegex, '');
    var parsedContent = new commonmark_1.Parser().parse(content);
    var writer = new commonmark_1.HtmlRenderer();
    var html = writer.render(parsedContent);
    var withWrapper = "<div class=\"post\">".concat(html, "</div>");
    var openTag = '<html>';
    var closeTag = '</html>';
    var finalRender = "".concat(openTag, headTemplate, styleTemplate, withWrapper, closeTag);
    return finalRender;
};
exports.renderPost = renderPost;
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
