import { connect, set } from 'mongoose';
import logger from '../config/logger';
import seedData from './User.seed';

const connectMongoDB = async () => {
  await connect(process.env.MONGO_URI);
  set('debug', true);
  await seedData();

  // eslint-disable-next-line no-console
  logger.info(`🚀 MongoDB ready with ${process.env.MONGO_URI}`);
};

export default connectMongoDB;
