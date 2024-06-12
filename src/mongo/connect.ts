import { connect } from 'mongoose';

const connectMongoDB = async () => {
  await connect(process.env.MONGO_URI);

  // eslint-disable-next-line no-console
  console.log('🚀 MongoDB ready');
};

export default connectMongoDB;
