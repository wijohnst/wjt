import { WjtSpacesClient, WJT_SPACES_BUCKET_ID } from './wjt-spaces-client';

import { S3Client, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3');

describe('WjtSpacesClient', () => {
  let sut: WjtSpacesClient;

  beforeEach(() => {
    const s3Client = new S3Client({});
    sut = new WjtSpacesClient(s3Client);
  });

  test('should be defined', () => {
    expect(WjtSpacesClient).toBeDefined();
  });

  describe('getBucketId', () => {
    test('should return the bucketId', () => {
      expect(sut.getBucketId()).toEqual(WJT_SPACES_BUCKET_ID);
    });
  });

  describe('getBucketContents', () => {
    test('should return the bucket contents', async () => {
      const sut: WjtSpacesClient = new WjtSpacesClient({
        send: jest.fn().mockResolvedValue({
          Contents: [
            {
              Key: 'image-1.jpg',
              LastModified: new Date('2024-12-25'),
              ETag: 'etag',
              Size: 123,
              StorageClass: 'STANDARD',
            },
          ],
        } as ListObjectsV2CommandOutput),
      } as unknown as S3Client);

      const response = await sut.getBucketContents();

      expect(response).toBeDefined();
      expect(response).toMatchSnapshot();
    });
  });
});
