const userTypeDef = `#graphql
type User {
  id: ID!
  name: String!
  followers: [User]
  following: [User]
}

type OptimizedUser {
  id: ID!
  name: String!
  followers: [OptimizedUser]
  following: [OptimizedUser]
}

type Query {
  getUsers: [User]
  optimizedGetUsers: [OptimizedUser]
}
`;

export default userTypeDef;
