import { test, describe, vi, expect, beforeEach, assert } from 'vitest';
import { ApolloServer } from '@apollo/server';
import Context from '../interface/Context.interface';
import typeDefs from '../schemas';
import resolvers from '.';
import User from '../../models/User.schema';
import IUser from '../../models/User.type';
import userDataLoader from '../../dataloader/User.dataLoader';

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
  const testServer = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  beforeEach(() => {
    vi.spyOn(User, 'find').mockReturnValue(usersMock);
  });
  test('should call getUsers with following/followers', async () => {
    const response = await testServer.executeOperation<{ getUsers: IUser[] }>({
      query: `
        query Users {
          getUsers {
            _id
            name
            following {
              _id
              name
            }
            followers {
              _id
              name
            }
          }
        }
      `,
    });
    expect(User.find).toHaveBeenCalledTimes(1 + usersMock.length * 2);
    assert(response.body.kind === 'single');
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.getUsers.length).toBe(usersMock.length);
  });
  test('should call optimizedGetUsers with following/followers', async () => {
    const response = await testServer.executeOperation<{ optimizedGetUsers: IUser[] }>(
      {
        query: `
        query OptimizedGetUsers {
          optimizedGetUsers {
            _id
            name
            following {
              _id
              name
            }
            followers {
              _id
              name
            }
          }
        }
      `,
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
});
