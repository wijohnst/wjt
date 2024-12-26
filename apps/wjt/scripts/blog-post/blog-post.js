"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
const blog_post_utils_1 = require("./blog-post.utils");
class BlogPost {
    constructor(rawPost) {
        this.rawPost = rawPost;
        this.parsedPost = (0, blog_post_utils_1.parseRawPost)(rawPost);
        this.postMarkup = (0, blog_post_utils_1.renderPost)(this.parsedPost);
        this._imageNodes = (0, blog_post_utils_1.getImageNodes)(this.parsedPost.content);
        this.initPostImages();
    }
    initPostImages() {
        this.postImages = this._imageNodes?.map((node) => {
            return (0, blog_post_utils_1.generatePostImage)(node);
        });
    }
    async listBucketContents() {
        await (0, blog_post_utils_1.listBucketContent)();
    }
}
exports.BlogPost = BlogPost;
