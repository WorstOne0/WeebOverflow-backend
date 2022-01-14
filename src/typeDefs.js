const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date
  scalar Anything

  type User {
    id: ID!
    email: String!
    password: String
    userName: String!
    role: String!
    screenName: String!
    profilePicture: String
    thumbnail: String
    posts: [Post!]!
    thirdParty: String!
    createdAt: Date!
  }

  type Post {
    id: ID!
    thumbnail: [Anything]
    title: String!
    text: [Text!]!
    postedBy: ID!
    user: User!
    tags: [String!]!
    likes: Int!
    comments: Int!
    createdAt: Date!
  }

  type Text {
    type: String!
    value: [Anything!]!
    files: [Upload]!
  }

  input TextInput {
    type: String!
    value: [Anything!]!
    files: [Upload]!
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
      reCaptchaToken: String!
    ): User
    emailExists(email: String!): Boolean
    userNameExists(userName: String!): Boolean
    updateUser: User!
    login(
      email: String!
      password: String!
      thirdParty: String!
      thirdPartyPayloadJSON: String
      reCaptchaToken: String!
    ): User
    logout: Boolean!

    addPost(
      title: String!
      thumbnail: [Anything]
      text: [TextInput!]!
      tags: [String]!
    ): Post
  }
`;
