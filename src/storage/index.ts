import {
  Bucket, CreateBucketCommand, ListBucketsCommand, S3Client,
} from '@aws-sdk/client-s3';

export default class Storage {
  private static s3: S3Client;

  public static bucketName = process.env.S3_BUCKET_NAME;

  public static getS3(): S3Client {
    if (!this.s3) {
      this.connect();
    }
    return this.s3;
  }

  private static async connect(): Promise<void> {
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION;

    if (!accessKeyId || !secretAccessKey || !endpoint || !this.bucketName || !region) {
      throw new Error('S3 env var not set');
    }

    this.s3 = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint,
      region,
      forcePathStyle: true,
    });

    await this.initBucket();
    console.log('Storage ready');
  }

  private static async initBucket(): Promise<void> {
    const buckets = await this.s3.send(new ListBucketsCommand({}));
    const anyBuckets = buckets.Buckets?.length;
    const ourBucket = buckets.Buckets?.find((bucket: Bucket) => bucket.Name === this.bucketName);

    if (!anyBuckets || !ourBucket) {
      const response = await this.s3.send(new CreateBucketCommand({
        Bucket: this.bucketName,
      }));
      console.log(response);
    }
  }
}
