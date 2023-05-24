import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { createHash } from 'node:crypto';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import database from '../database';
import storage from '../storage';
import { filterQuery, md5, upload } from './file.utils';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

function md5(content: Buffer) {
  return createHash('md5').update(content).digest('hex');
}

router.get('/', async (req: Request, res: Response) => {
  const db = await database.getDb();

  const params = req.query;
  const filteredQuery = filterQuery(params);

  const fileList = await db.collection('files').find(filteredQuery).toArray();
  return res.send(fileList);
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  const db = await database.getDb();
  const s3 = await storage.getS3();

  const { file, body } = req;

  if (!file) {
    throw new Error('No file uploaded');
  }

  const md5Hash = md5(file.buffer);
  if (body.md5 && body.md5 !== md5Hash) {
    throw new Error('File possibly corrupted');
  }

  const data = {
    name: body.name,
    originalname: file.originalname,
    author: body.author,
    user: body.user,
    md5: md5Hash,
    mimetype: file.mimetype,
    size: file.size,
    meta: body.meta,
  };

  const result = await db.collection('files').insertOne(data);
  await s3.send(new PutObjectCommand({
    Bucket: storage.bucketName,
    Key: result.insertedId.toString(),
    Body: file.buffer,
  }));

  return res.status(201).send(data);
});

export default router;
