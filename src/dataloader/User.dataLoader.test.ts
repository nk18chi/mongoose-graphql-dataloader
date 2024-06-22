import { test, describe, vi, expect, beforeEach } from 'vitest';
import { Types } from 'mongoose';
import User from '../models/User.schema';
import userDataLoader from './User.dataLoader';

const mockUsers = [
  {
    _id: new Types.ObjectId('666a86b3ee5b217b01281a01'),
    name: 'user1',
  },
  {
    _id: new Types.ObjectId('666a86b3ee5b217b01281a02'),
    name: 'user2',
  },
  {
    _id: new Types.ObjectId('666a86b3ee5b217b01281a03'),
    name: 'user3',
  },
];
const userIds = mockUsers.map((user) => user._id);
describe('userDataloader', () => {
  beforeEach(() => {
    vi.spyOn(User, 'find').mockResolvedValue(mockUsers);
  });
  test('should set unique userIds in fetching users from DB', async () => {
    await userDataLoader.loadMany([...userIds, userIds[0]]);
    expect(User.find).toHaveBeenCalledWith({ _id: { $in: userIds.map((userId) => userId.toString()) } });
  });
  test('should return fetched users from DB', async () => {
    const result = await userDataLoader.loadMany(userIds);
    expect(result).toEqual(mockUsers);
  });
  test('should remove duplicated users when fetching users from db but return the same size of array', async () => {
    const result = await userDataLoader.loadMany([...userIds, userIds[0]]);
    expect(result).toEqual([...mockUsers, mockUsers[0]]);
  });
});
