const userResolvers = require("./User");
const postResolvers = require("./Post");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },

  User: {
    ...userResolvers.User,
  },

  Post: {
    ...postResolvers.Post,
  },
};
