import { shield, allow } from 'graphql-shield';
import isAuthenticated from './rules/isAuthenticated.rule';

const permissions = shield({
  Query: {
    '*': isAuthenticated,
    getUsers: allow,
    optimizedGetUsers: allow,
  },
});

export default permissions;
