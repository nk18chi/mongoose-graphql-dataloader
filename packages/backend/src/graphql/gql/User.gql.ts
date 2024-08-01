const GQL_QUERY_GET_USERS = `
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

const GET_QUERY_USERS = `
  query Users($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          name
          followers {
            _id
            name
          }
          following {
            _id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export {
  GET_QUERY_USERS,
  GQL_QUERY_GET_USERS,
  GQL_QUERY_OPTIMIZED_USERS,
  GQL_QUERY_AUTHORIZED_USERS,
  GQL_QUERY_USER_TOKEN,
};
