import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

/* GET files listing. */
router.get('/', (req: Request, res: Response) => {
  res.send('respond with a resource');
});

export default router;
