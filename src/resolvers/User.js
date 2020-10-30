const { ApolloError, ValidationError } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const { createToken } = require("../jwt");
const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  Query: {
    users: () => User.find(),

    getUser: (_, { userId }) => {
      return User.findOne({ _id: userId });
    },

    getLoggedUser: async (_, __, { req }) => {
      if (!req.userId) return null;

      const user = await User.findOne({ _id: req.userId });

      return user;
    },
  },

  Mutation: {
    createUser: async (
      _,
      { email, password, userName, screenName, thirdParty }
    ) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (screenName === "") {
          screenName = `User#${Math.floor(
            (Math.random() * 1000000) % 1000000
          )}`;
        }

        const user = new User({
          email,
          password: hashedPassword,
          userName,
          screenName,
          thirdParty,
        });

        return await user.save();
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    emailExists: async (_, { email }) => {
      const user = await User.findOne({ email });

      if (user) return true;

      return false;
    },

    userNameExists: async (_, { userName }) => {
      const user = await User.findOne({ userName });

      if (user) return true;

      return false;
    },
    updateUser: async () => {},
    login: async (
      _,
      { email, password, thirdParty, thirdPartyPayloadJSON },
      { res }
    ) => {
      if (thirdParty === "None") {
        try {
          const user = await User.findOne({ email });

          if (!user) return null;

          if (!(await bcrypt.compare(password, user.password))) return null;

          const { accessToken, refreshToken } = createToken(user);

          res.cookie("accessToken", accessToken, { httpOnly: true });
          res.cookie("refreshToken", refreshToken, { httpOnly: true });

          return user;
        } catch (error) {
          throw new ApolloError(error);
        }
      }

      if (thirdParty === "Google") {
        const { idToken } = JSON.parse(thirdPartyPayloadJSON);

        const client = new OAuth2Client(process.env.CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();

        /*const user = await User.findOne({ email: payload["email"] });

        if(!user) {
          const hashedPassword = await bcrypt.hash("Google_User_Random_Password", 10);

          const newUser = new User({
            email,
            password: hashedPassword,
            userName,
            screenName,
            thirdParty,
          });
  
          return await newUser.save();
        }

        return user;*/
      }
    },
    logout: async (_, __, { req, res }) => {
      if (!req.userId) return false;

      const user = await User.findOne({ _id: req.userId });

      if (!user) return false;

      user.count += 1;
      await user.save();

      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");

      return true;
    },
  },

  User: {
    async posts(user) {
      try {
        return await Post.find({ postedBy: user.id });
      } catch (error) {
        throw new ValidationError("User ID not found");
      }
    },
  },
};
