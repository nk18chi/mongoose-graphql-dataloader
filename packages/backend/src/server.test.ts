import { expect, test, describe, vi, beforeEach, Mock } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import connectMongoDB from './mongo/connect';
import runServer from './server';
import logger from './config/logger';
import userDataLoader from './dataloader/User.dataLoader';

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
    vi.unstubAllEnvs();
  });
  test('start apollo server', async () => {
    await runServer();
    expect(ApolloServer.prototype.start).toHaveBeenCalledTimes(1);
  });
  test('set context', async () => {
    await runServer();
    expect(
      await (expressMiddleware as Mock).mock.calls[0][1].context({
        req: {
          headers: {
            authorization:
              // eslint-disable-next-line max-len
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjhlMTY5ZDU4Yjg2MDQ1YzFjNWEyYWEiLCJpYXQiOjE3MjA1ODc5MzN9.7YYezMRB5QTK8Ye7lSD2wwm5oWsP1A3u0Qcf-JgovFM',
          },
        },
      }),
    ).toEqual({
      user: {
        _id: '668e169d58b86045c1c5a2aa',
        iat: 1720587933,
      },
      dataLoaders: {
        userDataLoader,
      },
    });
  });
  test('listen localhost:4000', async () => {
    vi.stubEnv('NODE_ENV', 'development');
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
