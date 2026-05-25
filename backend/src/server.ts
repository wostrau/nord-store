import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './database/mongoose.js';

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
