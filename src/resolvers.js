const User = require("./models/User");
const Post = require("./models/Post");

module.exports = {
  Query: {
    users: () => User.find(),
    getUser: (_, { userId }) => {
      return User.findOne({ _id: userId });
    },
    posts: () => Post.find(),
    getPost: (_, { postId }) => {
      return Post.findOne({ _id: postId });
    },
  },

  User: {
    async posts(user) {
      return await Post.find({ postedBy: user.id });
    },
  },

  Post: {
    async user(post) {
      return await User.findOne({ _id: post.postedBy });
    },
  },

  Mutation: {
    createUser: async (
      _,
      { email, password, userName, screenName, thirdParty }
    ) => {
      const user = new User({
        email,
        password,
        userName,
        screenName,
        thirdParty,
      });
      return await user.save();
    },

    addPost: async (_, { userId, text, tags }) => {
      try {
        const post = new Post({
          postedBy: userId,
          text,
          tags,
          likes: 0,
          comments: 0,
        });

        return await post.save();

        /*await User.findOne({ _id: userId }, (err, user) => {
          user.posts = [...user.posts, post._id];
          user.save();
        });*/
      } catch (error) {
        console.log(error);
      }
    },
  },
};
