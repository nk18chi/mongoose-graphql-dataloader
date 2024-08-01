import { shield, allow } from 'graphql-shield';
import isAuthenticated from './rules/isAuthenticated.rule';

const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
      users: allow,
      getUsers: allow,
      optimizedGetUsers: allow,
      userToken: allow,
    },
  },
  {
    allowExternalErrors: true,
  },
);

export default permissions;
