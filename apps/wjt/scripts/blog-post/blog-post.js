"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
var blog_post_utils_1 = require("./blog-post.utils");
var BlogPost = /** @class */ (function () {
    function BlogPost(rawPost) {
        this.rawPost = rawPost;
        this.parsedPost = null;
        this.postMarkup = null;
        this.parsedPost = (0, blog_post_utils_1.parseRawPost)(rawPost);
        this.postMarkup = (0, blog_post_utils_1.renderPost)(this.parsedPost);
    }
    return BlogPost;
}());
exports.BlogPost = BlogPost;
