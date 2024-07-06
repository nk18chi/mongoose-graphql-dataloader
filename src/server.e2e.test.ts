import { expect, test, describe, vi, beforeEach } from 'vitest';
import request from 'supertest';
import runServer from './server';
import { GQL_QUERY_USERS } from './graphql/gql/User.gql';
import logger from './config/logger';

vi.mock('./config/logger');
describe('e2e: server.ts', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  describe('graphql-query-complexity', async () => {
    test('should throw error when complexity is greater than MAX_COMPLEXITY', async () => {
      vi.stubEnv('GRAPHQL_QUERY_MAX_COMPLEXITY', '5');
      console.log('1');
      const testApp = await runServer();
      console.log('2');
      const res = await request(testApp).post('/graphql').send({
        query: GQL_QUERY_USERS,
      });
      console.log('3');
      expect(res.body.errors[0].message).toBe(
        'Sorry, too complicated query! 7 exceeded the maximum allowed complexity of 5 by Users',
      );
    });

    test('should log when complexity is less than MAX_COMPLEXITY', async () => {
      const testApp = await runServer();
      await request(testApp).post('/graphql').send({
        query: GQL_QUERY_USERS,
      });
      expect(logger.info).toHaveBeenCalledWith('Used query complexity points: 7 by Users');
    });

    test('should skip introspection query', async () => {
      const testApp = await runServer();
      const res = await request(testApp)
        .post('/graphql')
        .send({
          query: `query IntrospectionQuery {
            __schema {
              types {
                name
              }
            }
          }`,
        });
      expect(res.body.errors?.[0]?.message).not.toBeDefined();
      expect(logger.info).not.toHaveBeenCalledWith('Used query complexity points: 0 by IntrospectionQuery');
    });
  });
});
