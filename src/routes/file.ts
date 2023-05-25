import type { Request, Response } from 'express';
import express from 'express';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import database from '../database';
import storage from '../storage';
import { filterQuery, md5, upload } from './file.utils';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await database.getDb();
    const s3 = await storage.getS3();

    const { id } = req.params;

    const fileMeta = await db.collection('files').findOne({ _id: new ObjectId(id) });
    if (!fileMeta) {
      return res.sendStatus(404);
    }

    const response = await s3.send(new GetObjectCommand({
      Bucket: storage.bucketName,
      // eslint-disable-next-line no-underscore-dangle
      Key: fileMeta._id.toString(),
    }));

    if (!(response.Body instanceof Readable)) { // Checking if Body is a stream
      return res.status(500).send('Could not retrieve the file');
    }

    res.setHeader('Content-disposition', `attachment; filename=${fileMeta.originalname}`);
    res.setHeader('Content-type', 'application/octet-stream');
    return response.Body.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await database.getDb();

    const params = req.query;
    const filteredQuery = filterQuery(params);

    const fileList = await db.collection('files').find(filteredQuery).toArray();
    return res.send(fileList);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

export default router;
