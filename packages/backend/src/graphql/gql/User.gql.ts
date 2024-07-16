const GQL_QUERY_USERS = `
  query Users {
    getUsers {
      _id
      name
      following {
        name
      }
      followers {
        name
      }
    }
  }
`;

const GQL_QUERY_OPTIMIZED_USERS = `
  query OptimizedGetUsers {
    optimizedGetUsers {
      name
      _id
      following {
        name
      }
      followers {
        name
      }
    }
  }
`;

const GQL_QUERY_AUTHORIZED_USERS = `
  query AuthorizedGetUsers {
    authorizedGetUsers {
      name
      _id
      following {
        name
      }
      followers {
        name
      }
    }
  }
`;

const GQL_QUERY_USER_TOKEN = `
  query UserToken {
    userToken
  }
`;

export { GQL_QUERY_USERS, GQL_QUERY_OPTIMIZED_USERS, GQL_QUERY_AUTHORIZED_USERS, GQL_QUERY_USER_TOKEN };
