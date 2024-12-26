import {
  S3Client,
  S3ClientConfig,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';

export const WJT_SPACES_BUCKET_ID = `wjt`;
export const WJT_SPACES_ORIGIN_ENDPOINT =
  'https://wjt.sfo2.digitaloceanspaces.com';
export const WJT_SPACES_CDN_ENDPOINT =
  'https://wjt.sfo2.cdn.digitaloceanspaces.com';
export const WJT_SPACES_ENDPOINT = 'https://sfo2.digitaloceanspaces.com';
export const WJT_SPACES_REGION = 'sfo2';
export interface IWjtSpacesClient {
  s3Client: S3Client;
  bucketId: string;

  getBucketId(): string;
  getBucketContents(): Promise<unknown>;
}

export type WjtSpacesClientConfig = S3ClientConfig & {
  forcePathStyle?: boolean;
  endpoint: string;
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};
export class WjtSpacesClient {
  constructor(
    private s3Client: S3Client,
    private readonly bucketId: string = WJT_SPACES_BUCKET_ID
  ) {}

  /**
   * Returns the bucketId for the target S3 bucket
   * @returns {string}
   */
  public getBucketId(): string {
    return this.bucketId;
  }

  /**
   * Returns the contents of the target S3 bucket
   * @returns {Promise<ListObjectsV2CommandOutput['Contents']>}
   */
  public async getBucketContents(): Promise<
    ListObjectsV2CommandOutput['Contents']
  > {
    const params: ListObjectsV2CommandInput = {
      Bucket: this.bucketId,
    };
    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    return response.Contents;
  }
}

/**
 * Returns a new instance of WjtSpacesClient with the provided configuration
 * @param {WjtSpacesClientConfig} config
 * @returns {WjtSpacesClient}
 */
export const wjtSpaceClientFactory = (
  config: WjtSpacesClientConfig
): WjtSpacesClient => {
  return new WjtSpacesClient(new S3Client(config));
};
