const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    password: String
    userName: String!
    screenName: String!
    profilePicture: String
    thumbnail: String
    posts: [Post!]!
    thirdParty: String!
  }

  type Post {
    id: ID!
    text: String!
    postedBy: ID!
    user: User!
    tags: [String!]!
    likes: Int!
    comments: Int!
  }

  type Query {
    users: [User!]!
    getUser(userId: ID!): User
    getLoggedUser: User

    posts: [Post!]!
    getPost(postId: ID!): Post
  }

  type Mutation {
    createUser(
      email: String!
      password: String
      userName: String!
      screenName: String!
      thirdParty: String!
    ): User
    updateUser: User!
    login(
      email: String!
      password: String!
      thirdParty: String!
      thirdPartyPayloadJSON: String
    ): User
    logout: Boolean!

    addPost(text: String!, tags: [String!]!): Post
  }
`;
