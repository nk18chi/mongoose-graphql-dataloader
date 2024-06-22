import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ApolloServer } from '@apollo/server';
import connectMongoDB from './mongo/connect';
import runServer from './server';
import logger from './config/logger';

vi.mock('./mongo/connect');
vi.mock('express', () => ({
  __esModule: true,
  default: () => ({
    use: () => vi.fn(),
  }),
}));
let mockListen: unknown;
vi.mock('http', () => ({
  __esModule: true,
  default: {
    createServer: () => ({
      listen: mockListen,
    }),
  },
}));
vi.mock('./config/logger');
vi.mock('@apollo/server/express4', () => ({
  expressMiddleware: vi.fn(),
}));
vi.mock('@apollo/server/plugin/drainHttpServer', () => ({
  ApolloServerPluginDrainHttpServer: vi.fn(),
}));
describe('server.ts', () => {
  beforeEach(() => {
    vi.spyOn(ApolloServer.prototype, 'start').mockReturnValue(Promise.resolve());
    mockListen = vi.fn().mockImplementation((_, callback) => callback());
  });
  test('start apollo server', async () => {
    await runServer();
    expect(ApolloServer.prototype.start).toHaveBeenCalledTimes(1);
  });
  test('listen localhost:4000', async () => {
    await runServer();
    expect(mockListen).toHaveBeenCalledTimes(1);
  });
  test('connect mongo db', async () => {
    await runServer();
    expect(connectMongoDB).toHaveBeenCalledTimes(1);
  });
  test('log when the app started', async () => {
    await runServer();
    expect(logger.info).toHaveBeenCalledWith('🚀 Server ready at http://localhost:4000');
  });
});
