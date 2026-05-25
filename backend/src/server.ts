import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.info(`Nord Store backend listening on port ${env.port}.`);
    });
  } catch (error) {
    console.error('Failed to start server.', error);
    process.exit(1);
  }
};

void startServer();
