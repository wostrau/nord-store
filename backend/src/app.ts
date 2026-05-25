import cors from 'cors';
import express from 'express';

import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import { healthRouter } from './routes/health.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
