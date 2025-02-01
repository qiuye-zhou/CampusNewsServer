import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { MONGO_DB } from '~/app.config';

let databaseConnection: mongoose.Connection | null = null;

export const getDatabaseConnection = async () => {
  if (databaseConnection) {
    return databaseConnection;
  }
  let reconnectionTask: NodeJS.Timeout | null = null;
  const RECONNECT_INTERVAL = 6000;

  const connection = () => {
    return mongoose.connect(MONGO_DB.uri, {});
  };
  const Badge = `MongoDB`;
  mongoose.connection.on('connecting', () => {
    Logger.log(`${Badge} connecting...`, Badge);
  });

  mongoose.connection.on('open', () => {
    Logger.log(`${Badge} readied!`, Badge);
    if (reconnectionTask) {
      clearTimeout(reconnectionTask);
      reconnectionTask = null;
    }
  });

  mongoose.connection.on('disconnected', () => {
    Logger.error(
      `${Badge} disconnected! retry when after ${RECONNECT_INTERVAL / 1000}s`,
      Badge,
    );
    reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
  });

  mongoose.connection.on('error', (error) => {
    Logger.error(`${Badge} error!`, error, Badge);
    mongoose.disconnect();
  });

  databaseConnection = await connection().then(
    (mongoose) => mongoose.connection,
  );
  return databaseConnection!;
};
