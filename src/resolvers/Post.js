const { ApolloError, ValidationError } = require("apollo-server-express");

const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  Query: {
    posts: () => Post.find(),
    getPost: (_, { postId }) => {
      return Post.findOne({ _id: postId });
    },
  },

  Mutation: {
    addPost: async (_, { text, tags }, { req }) => {
      if (!req.userId) return null;

      try {
        const post = new Post({
          postedBy: req.userId,
          text,
          tags,
          likes: 0,
          comments: 0,
        });

        return await post.save();
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },

  Post: {
    async user(post) {
      try {
        return await User.findOne({ _id: post.postedBy });
      } catch (error) {
        throw new ValidationError("Post ID not found");
      }
    },
  },
};
