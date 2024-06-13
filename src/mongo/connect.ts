import { connect } from 'mongoose';
import logger from '../config/logger';
import seedData from './seed';

const connectMongoDB = async () => {
  await connect(process.env.MONGO_URI);
  await seedData();

  // eslint-disable-next-line no-console
  logger.info(`🚀 MongoDB ready with ${process.env.MONGO_URI}`);
};

export default connectMongoDB;
