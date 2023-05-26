import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import indexRouter from './routes/index';
import fileRouter from './routes/file';

const app = express();

app.use(helmet());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/file', fileRouter);

export default app;
