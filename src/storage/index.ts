import {
  Bucket, CreateBucketCommand, ListBucketsCommand, S3Client,
} from '@aws-sdk/client-s3';

const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const endpoint = process.env.S3_ENDPOINT;

if (!accessKeyId || !secretAccessKey || !endpoint) {
  throw new Error('S3 variables missing');
}

export const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint,
  region: 'eu-central-1',
  forcePathStyle: true,
});

export const bucketName = 'files';

async function initBucket() {
  const buckets = await s3.send(new ListBucketsCommand({}));
  const anyBuckets = buckets.Buckets?.length;
  const ourBucket = buckets.Buckets?.find((bucket: Bucket) => bucket.Name === bucketName);
  if (!anyBuckets || !ourBucket) {
    const response = await s3.send(new CreateBucketCommand({
      Bucket: bucketName,
    }));
    console.log(response);
  }
  return true;
}
initBucket().then(() => console.log('Bucket exists'));
