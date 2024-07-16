import { expect, test, describe, vi, beforeEach } from 'vitest';
import { connect, set } from 'mongoose';
import connectMongoDB from './connect';
import seedData from './User.seed';
import logger from '../config/logger';

vi.mock('mongoose');
vi.mock('./User.seed');
vi.mock('../config/logger');
describe('connectMongoDB', () => {
  beforeEach(() => {
    process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test';
  });
  test('connect mongoDB', async () => {
    await connectMongoDB();
    expect(connect).toHaveBeenCalledWith(process.env.MONGO_URI);
  });
  test('set debug as true', async () => {
    await connectMongoDB();
    expect(set).toHaveBeenCalledWith('debug', true);
  });
  test('call seedData function', async () => {
    await connectMongoDB();
    expect(seedData).toHaveBeenCalledTimes(1);
  });
  test('log when mongoDB is ready', async () => {
    await connectMongoDB();
    expect(logger.info).toHaveBeenCalledWith(`🚀 MongoDB ready with ${process.env.MONGO_URI}`);
  });
});
