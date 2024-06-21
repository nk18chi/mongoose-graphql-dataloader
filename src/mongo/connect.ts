import { connect, set } from 'mongoose';
import logger from '../config/logger';
import seedData from './User.seed';

const connectMongoDB = async () => {
  await connect(process.env.MONGO_URI);
  set('debug', true);
  await seedData();
  logger.info(`🚀 MongoDB ready with ${process.env.MONGO_URI}`);
};

export default connectMongoDB;
