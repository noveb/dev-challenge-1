import express from 'express';
import morgan from 'morgan';

import indexRouter from './routes/index';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

export default app;
