import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './database/mongoose.js';
import { connectRedis, disconnectRedis } from './database/redis.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await connectRedis();

    const server = app.listen(env.port, () => {
      console.info(`Nord Store backend listening on port ${env.port}.`);
    });

    const shutdown = (signal: NodeJS.Signals): void => {
      console.info(`${signal} received. Shutting down backend.`);

      server.close((error) => {
        void (async () => {
          if (error) {
            console.error('Failed to close HTTP server.', error);
          }

          await disconnectRedis();
          process.exit(error ? 1 : 0);
        })();
      });
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server.', error);
    process.exit(1);
  }
};

void startServer();
