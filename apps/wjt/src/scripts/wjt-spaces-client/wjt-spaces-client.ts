import {
  S3Client,
  S3ClientConfig,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';

export const WJT_SPACES_BUCKET_ID = `wjt`;
export const WJT_SPACES_ORIGIN_ENDPOINT = `https://wjt.sfo2.cdn.digitaloceanspaces.com`;
export const WJT_SPACES_CDN_ENDPOINT = `https://cdn.wjt.com`;
export const WJT_SPACES_ENDPOINT = `https://sfo2.digitaloceanspaces.com`;
export const WJT_SPACES_REGION = `sfo2`;

export interface IWjtSpacesClient {
  s3Client: S3Client;
  bucketId: string;

  getBucketId(): string;
  getBucketContents(): Promise<unknown>;
}

export type WjtSpacesClientConfig = S3ClientConfig & {};
export class WjtSpacesClient {
  constructor(
    private s3Client: S3Client,
    private readonly bucketId: string = WJT_SPACES_BUCKET_ID
  ) {}

  public getBucketId(): string {
    return this.bucketId;
  }

  public async getBucketContents(): Promise<unknown> {
    const params: ListObjectsV2CommandInput = {
      Bucket: this.bucketId,
    };
    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    return response;
  }
}

export const wjtSpacesClientFactory = (
  config: WjtSpacesClientConfig
): WjtSpacesClient => {
  return new WjtSpacesClient(new S3Client(config));
};
