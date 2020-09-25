const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    password: String
    userName: String!
    screenName: String!
    profilePicture: String!
    thumbnail: String!
    posts: [Post!]!
    thirdParty: String!
  }

  type Post {
    id: ID!
    text: String!
    postedBy: String!
    user: User!
    tags: [String!]!
    likes: Int!
    comments: Int!
  }

  type Query {
    users: [User!]!
    getUser(userId: String!): User!
    posts: [Post!]!
    getPost(postId: String!): Post!
  }

  type Mutation {
    createUser(
      email: String!
      password: String
      userName: String!
      screenName: String!
      thirdParty: String!
    ): User!
    addPost(userId: String!, text: String!, tags: [String!]!): Post!
  }
`;
