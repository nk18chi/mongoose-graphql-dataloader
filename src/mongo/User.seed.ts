import logger from '../config/logger';
import User from '../models/User.schema';

const seedData = async () => {
  console.log('?');
  const count = await User.countDocuments();
  console.log('??', count);
  if (count > 0) {
    logger.info('Database already seeded');
    return;
  }
  console.log('???');
  await User.insertMany(
    [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
      { name: 'Eve' },
      { name: 'Frank' },
      { name: 'Grace' },
      { name: 'Heidi' },
      { name: 'Ivan' },
      { name: 'Judy' },
      { name: 'Kevin' },
      { name: 'Lily' },
      { name: 'Mallory' },
      { name: 'Nia' },
      { name: 'Oscar' },
      { name: 'Peggy' },
      { name: 'Quentin' },
      { name: 'Rita' },
      { name: 'Steve' },
      { name: 'Trent' },
      { name: 'Ursula' },
      { name: 'Victor' },
      { name: 'Wendy' },
      { name: 'Xander' },
      { name: 'Yvonne' },
      { name: 'Zoe' },
    ],
    { ordered: false },
  );
  console.log('????');
  const followList = [
    {
      target: 'Alice',
      followers: ['Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'],
      following: ['Bob', 'Eve', 'Wendy', 'Xander', 'Yvonne'],
    },
    { target: 'Bob', followers: ['Eve', 'Frank'], following: ['Alice', 'Charlie', 'David'] },
    { target: 'Charlie', followers: ['David', 'Eve', 'Frank', 'Grace'], following: ['Alice', 'Bob'] },
    { target: 'David', followers: ['Alice', 'Bob', 'Charlie', 'Eve'], following: ['Alice', 'Charlie'] },
    {
      target: 'Eve',
      followers: ['Alice', 'Bob', 'Charlie', 'David', 'Frank', 'Grace'],
      following: ['Alice', 'Bob', 'Charlie'],
    },
    { target: 'Frank', followers: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'], following: ['Alice', 'Charlie'] },
  ];
  console.log('?????');
  followList.map(async (list) => {
    const user = await User.findOne({ name: list.target });
    if (!user) {
      logger.error('Alice not found');
      return;
    }
    const followers = await User.find({ name: { $in: list.followers } });
    const followings = await User.find({ name: { $in: list.following } });
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          followers: followers.map((follower) => follower._id),
          following: followings.map((following) => following._id),
        },
      },
    );
  });
  console.log('??????');
  logger.info('User data is seeded');
};

export default seedData;
