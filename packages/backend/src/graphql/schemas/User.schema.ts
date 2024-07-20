const userTypeDef = `#graphql
type User @cacheControl(maxAge: 60) {
  _id: ID!
  name: String!
  followers: [User]
  following: [User]
}

type OptimizedUser @cacheControl(maxAge: 60) {
  _id: ID!
  name: String!
  followers: [User]
  following: [User]
}

type Query {
  getUsers: [User]
  optimizedGetUsers: [OptimizedUser]
  authorizedGetUsers: [User]
  userToken: String @cacheControl(maxAge: 0) @rateLimit(limit: 3, duration: 5)
}
`;

export default userTypeDef;
