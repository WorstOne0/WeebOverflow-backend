const { ApolloError, ValidationError } = require("apollo-server-express");
const AWS = require("aws-sdk");
const fs = require("fs");

require("dotenv").config();

const User = require("../models/User");
const Post = require("../models/Post");

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
  region: process.env.AWS_S3_REGION,
});

module.exports = {
  Query: {
    posts: () => Post.find(),
    getPost: (_, { postId }) => {
      return Post.findOne({ _id: postId });
    },
  },

  Mutation: {
    addPost: async (_, { title, thumbnail, text, tags }, { req }) => {
      if (!req.userId) return null;

      console.log("Post Recebido e Valido");

      try {
        const post = new Post({
          postedBy: req.userId,
          thumbnail,
          title,
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
