import cors from 'cors';
import express from 'express';

import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { orderRouter } from './routes/order.routes.js';
import { productRouter } from './routes/product.routes.js';
import { RoutePath } from './routes/route-paths.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(RoutePath.api.auth, authRouter);
app.use(RoutePath.api.products, productRouter);
app.use(RoutePath.api.admin, adminRouter);
app.use(RoutePath.api.cart, cartRouter);
app.use(RoutePath.api.orders, orderRouter);
app.use(RoutePath.api.health, healthRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
