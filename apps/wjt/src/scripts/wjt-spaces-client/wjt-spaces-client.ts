import {
  S3Client,
  S3ClientConfig,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';

export const WJT_SPACES_BUCKET_ID = `s3://wjt`;
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
