"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wjtSpaceClientFactory = exports.WjtSpacesClient = exports.WJT_SPACES_REGION = exports.WJT_SPACES_ENDPOINT = exports.WJT_SPACES_CDN_ENDPOINT = exports.WJT_SPACES_ORIGIN_ENDPOINT = exports.WJT_SPACES_BUCKET_ID = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
exports.WJT_SPACES_BUCKET_ID = `wjt`;
exports.WJT_SPACES_ORIGIN_ENDPOINT = 'https://wjt.sfo2.digitaloceanspaces.com';
exports.WJT_SPACES_CDN_ENDPOINT = 'https://wjt.sfo2.cdn.digitaloceanspaces.com';
exports.WJT_SPACES_ENDPOINT = 'https://sfo2.digitaloceanspaces.com';
exports.WJT_SPACES_REGION = 'sfo2';
class WjtSpacesClient {
    constructor(s3Client, bucketId = exports.WJT_SPACES_BUCKET_ID) {
        this.s3Client = s3Client;
        this.bucketId = bucketId;
    }
    getBucketId() {
        return this.bucketId;
    }
    async getBucketContents() {
        const params = {
            Bucket: this.bucketId,
        };
        const command = new client_s3_1.ListObjectsV2Command(params);
        const response = await this.s3Client.send(command);
        return response;
    }
}
exports.WjtSpacesClient = WjtSpacesClient;
const wjtSpaceClientFactory = (config) => {
    return new WjtSpacesClient(new client_s3_1.S3Client(config));
};
exports.wjtSpaceClientFactory = wjtSpaceClientFactory;
