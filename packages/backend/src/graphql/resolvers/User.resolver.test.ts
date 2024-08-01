import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { Types } from 'mongoose';
import { rateLimitDirective } from 'graphql-rate-limit-directive';
import Context from '../interface/Context.interface';
import typeDefs from '../schemas';
import resolvers from '.';
import User from '../../models/User.schema';
import IUser from '../../models/User.type';
import userDataLoader from '../../dataloader/User.dataLoader';
import {
  GQL_QUERY_GET_USERS,
  GQL_QUERY_OPTIMIZED_USERS,
  GQL_QUERY_AUTHORIZED_USERS,
  GQL_QUERY_USER_TOKEN,
  GET_QUERY_USERS,
} from '../gql/User.gql';
import permissions from '../authorizations/permissions';
import { UserConnection } from '../types';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usersMock: any = [
  {
    _id: '666a86b3ee5b217b01281a39',
    name: 'Alice',
    following: ['666a86b3ee5b217b01281a3a'],
    followers: ['666a86b3ee5b217b01281a3a'],
  },
  {
    _id: '666a86b3ee5b217b01281a3a',
    name: 'Bob',
    following: [],
    followers: [],
  },
  {
    _id: '666a86b3ee5b217b01281a3a',
    name: 'Eva',
    following: [],
    followers: [],
  },
];
describe('User.resolver.ts', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chainableMock: any = {};
  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs: [...typeDefs, rateLimitDirectiveTypeDefs],
      resolvers,
    }),
    permissions,
  );
  const testServer = new ApolloServer<Context>({
    schema: rateLimitDirectiveTransformer(schema),
  });
  const pagination = 2;

  beforeEach(() => {
    chainableMock = {
      lean: vi.fn().mockReturnValue(usersMock),
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    };
    vi.spyOn(User, 'find').mockReturnValue(chainableMock);
    vi.stubEnv('JWT_PRIVATE_KEY', 'testJWTPrivateKey');
  });
  describe('users query', () => {
    test('should call users with first variable', async () => {
      const response = await testServer.executeOperation<{ users: UserConnection }>({
        query: GET_QUERY_USERS,
        variables: { first: pagination },
      });
      expect(User.find).toHaveBeenCalledWith({});
      expect(chainableMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableMock.limit).toHaveBeenCalledWith(pagination + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.users).toEqual({
        edges: usersMock.slice(0, -1).map((user: IUser) => ({
          cursor: user._id,
          node: expect.any(Object),
        })),
        pageInfo: {
          endCursor: usersMock[usersMock.length - 2]._id,
          hasNextPage: true,
        },
      });
    });
    test('should call users with first and after variables', async () => {
      const response = await testServer.executeOperation<{ users: UserConnection }>({
        query: GET_QUERY_USERS,
        variables: { first: pagination, after: 'lastCursorId' },
      });
      expect(User.find).toHaveBeenCalledWith({ _id: { $gt: 'lastCursorId' } });
      expect(chainableMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableMock.limit).toHaveBeenCalledWith(pagination + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
    });
    test('should set hasNextPage as false when there is no next page', async () => {
      const response = await testServer.executeOperation<{ users: UserConnection }>({
        query: GET_QUERY_USERS,
        variables: { first: usersMock.length + 1, after: 'lastCursorId' },
      });
      expect(User.find).toHaveBeenCalledWith({ _id: { $gt: 'lastCursorId' } });
      expect(chainableMock.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(chainableMock.limit).toHaveBeenCalledWith(usersMock.length + 1 + 1);
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.users.pageInfo?.hasNextPage).toBe(false);
    });
  });
  test('should call getUsers with following/followers', async () => {
    const response = await testServer.executeOperation<{ getUsers: IUser[] }>({
      query: GQL_QUERY_GET_USERS,
    });
    expect(User.find).toHaveBeenCalledTimes(1 + usersMock.length * 2);
    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.getUsers.length).toBe(usersMock.length);
  });
  test('should call optimizedGetUsers with following/followers', async () => {
    const response = await testServer.executeOperation<{ optimizedGetUsers: IUser[] }>(
      {
        query: GQL_QUERY_OPTIMIZED_USERS,
      },
      {
        contextValue: {
          dataLoaders: {
            userDataLoader,
          },
        },
      },
    );
    expect(User.find).toHaveBeenCalledTimes(2);
    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.optimizedGetUsers.length).toBe(usersMock.length);
  });
  test('should call authorizedGetUsers with user context', async () => {
    const response = await testServer.executeOperation<{ authorizedGetUsers: IUser[] }>(
      {
        query: GQL_QUERY_AUTHORIZED_USERS,
      },
      {
        contextValue: {
          user: {
            _id: new Types.ObjectId(),
          },
          dataLoaders: {
            userDataLoader,
          },
        },
      },
    );
    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.authorizedGetUsers.length).toBe(usersMock.length);
  });
  test('should not call authorizedGetUsers without user context', async () => {
    const response = await testServer.executeOperation<{ authorizedGetUsers: IUser[] }>({
      query: GQL_QUERY_AUTHORIZED_USERS,
    });
    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors?.[0].message).toEqual('Not Authorised!');
  });
  test('should return user token', async () => {
    const response = await testServer.executeOperation<{ userToken: string }>(
      {
        query: GQL_QUERY_USER_TOKEN,
      },
      {},
    );
    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.userToken).toBeDefined();
  });
});
