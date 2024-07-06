import { connect, set } from 'mongoose';
import logger from '../config/logger';
import seedData from './User.seed';

const connectMongoDB = async () => {
  console.log('!');
  await connect(process.env.MONGO_URI);
  console.log('!!');
  set('debug', true);
  console.log('!!!');
  await seedData();
  console.log('!!!!');
  logger.info(`🚀 MongoDB ready with ${process.env.MONGO_URI}`);
};

export default connectMongoDB;
