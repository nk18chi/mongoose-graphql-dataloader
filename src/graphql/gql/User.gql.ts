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

export { GQL_QUERY_USERS, GQL_QUERY_OPTIMIZED_USERS };
