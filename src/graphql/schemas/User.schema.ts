const userTypeDef = `#graphql
type User {
  _id: ID!
  name: String!
  followers: [User]
  following: [User]
}

type OptimizedUser {
  _id: ID!
  name: String!
  followers: [User]
  following: [User]
}

type Query {
  getUsers: [User]
  optimizedGetUsers: [OptimizedUser]
  authorizedGetUsers: [User]
}
`;

export default userTypeDef;
