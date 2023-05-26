import type { Request, Response } from 'express';
import express from 'express';
import { ListBucketsCommand } from '@aws-sdk/client-s3';

import database from '../database';
import storage from '../storage';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [db, s3] = await Promise.all([
      database.getDb(),
      storage.getS3(),
    ]);

    const [dbReady, storageReady] = await Promise.all([
      db.stats(), s3.send(new ListBucketsCommand({})),
    ]);

    const result = {
      apiReady: true,
      dbReady: !!dbReady,
      storageReady: !!storageReady,
    };

    return res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

export default router;
