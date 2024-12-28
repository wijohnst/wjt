import {
  S3Client,
  S3ClientConfig,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';

export const WJT_SPACES_BUCKET_ID = `wjt`;
export const WJT_SPACES_ORIGIN_ENDPOINT = `https://wjt.sfo2.digitaloceanspaces.com`;
export const WJT_SPACES_CDN_ENDPOINT = `https://wjt.sfo2.cdn.digitaloceanspaces.com`;
export const WJT_SPACES_ENDPOINT = `https://sfo2.digitaloceanspaces.com`;
export const WJT_SPACES_REGION = `sfo2`;

export interface IWjtSpacesClient {
  s3Client: S3Client;
  bucketId: string;

  getBucketId(): string;
  getBucketContents(): Promise<unknown>;
}

export type WjtSpacesClientConfig = S3ClientConfig & {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export const wjtSpacesClientDefaultConfig: WjtSpacesClientConfig = {
  region: WJT_SPACES_REGION,
  endpoint: WJT_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WJT_SPACES_CLIENT_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.WJT_SPACES_CLIENT_SECRET ?? '',
  },
};
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

    try {
      const { Contents } = await this.s3Client.send(command);
      return Contents;
    } catch (error) {
      console.error(error);
    }
  }
}

export const wjtSpacesClientFactory = (
  config: WjtSpacesClientConfig
): WjtSpacesClient => {
  return new WjtSpacesClient(new S3Client(config));
};
