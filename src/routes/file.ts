import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { createHash } from 'node:crypto';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import database from '../database';
import { s3, bucketName } from '../storage';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

function md5(content: Buffer) {
  return createHash('md5').update(content).digest('hex');
}

router.get('/', async (req: Request, res: Response) => {
  const db = await database.getDb();

  const fileList = await db.collection('files').find({}, { projection: { name: 1, id: 1 } }).toArray();
  return res.status(200).send(fileList);
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  const db = await database.getDb();
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
    author: body.author,
    user: body.user,
    md5: md5Hash,
    mimetype: file.mimetype,
    size: file.size,
    meta: body.meta,
  };

  await db.collection('files').insertOne(data);
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: data.name,
    Body: file.buffer,
  }));

  return res.status(204).send(data);
});

export default router;
