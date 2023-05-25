import type QueryString from 'qs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';

export function filterQuery(params: QueryString.ParsedQs) {
  const query: { [key: string]: string | undefined; } = {
    name: params.name as string,
    author: params.author as string,
    user: params.user as string,
  };

  return Object.entries(query).reduce((result, [key, value]) => {
    if (value !== undefined) {
      return { ...result, [key]: query[key] };
    }
    return result;
  }, {});
}

export function md5(content: Buffer) {
  return createHash('md5').update(content).digest('hex');
}

export function sanitizeFile(file: Express.Multer.File, cb: Function) {
  /**
   * I really don't like to accept file of any type, unchecked. At least here
   * is a boilerplate to block some file extensions and mime types. All files should be
   * processed by a virus scanner like https://github.com/Cisco-Talos/clamav
   */
  const blockedFileExts = ['.exe'];

  const isBlockedExt = blockedFileExts.includes(
    path.extname(file.originalname.toLowerCase()),
  );

  const blockedMimeTypes = ['application/x-msdos-program'];
  const isBlockedMimeType = blockedMimeTypes.includes(file.mimetype);

  if (isBlockedExt || isBlockedMimeType) {
    return cb('File type not allowed');
  }
  return cb(null, true);
}

const multerStorage = multer.memoryStorage();
export const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    /**
     * 128 mb file size as unlimited size could very easily exceed memory
     * if upload for huge files is needed, files needed to be streamed through
     * api to S3 or client should get a s3 upload link as described
     * here https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
     */
    fileSize: 1024 * 1024 * 128,
  },
});
