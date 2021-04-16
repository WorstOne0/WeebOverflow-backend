const { ApolloError, ValidationError } = require("apollo-server-express");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const { createToken } = require("../jwt");
const User = require("../models/User");
const Post = require("../models/Post");

const cookieConfig =
  process.env.COOKIE_LIVE === "true"
    ? { httpOnly: true, sameSite: "none", secure: true }
    : { httpOnly: true };

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
      { email, password, userName, screenName, thirdParty, reCaptchaToken }
    ) => {
      try {
        // ReCaptcha
        const res = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY_SECRET}&response=${reCaptchaToken}`,
          { method: "POST" }
        );

        const { success } = await res.json();
        if (!success) throw new ApolloError("Robot Detected");

        // Hash the Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a default random ScreenName
        if (screenName === "") {
          screenName = `User#${Math.floor(
            (Math.random() * 1000000) % 1000000
          )}`;
        }

        // Create a User
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
      // Try to find e user with the Email
      const user = await User.findOne({ email });

      if (user) return true;

      return false;
    },

    userNameExists: async (_, { userName }) => {
      // Try to find e user with the UserName
      const user = await User.findOne({ userName });

      if (user) return true;

      return false;
    },
    updateUser: async () => {},
    login: async (
      _,
      { email, password, thirdParty, thirdPartyPayloadJSON, reCaptchaToken },
      { res }
    ) => {
      if (thirdParty === "None") {
        try {
          // ReCaptcha
          const reCaptcha = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY_SECRET}&response=${reCaptchaToken}`,
            { method: "POST" }
          );

          const { success } = await reCaptcha.json();
          if (!success) throw new ApolloError("Robot Detected");

          // Try to find e user
          const user = await User.findOne({ email });

          if (!user) return null;

          // Decrypt the Password
          if (!(await bcrypt.compare(password, user.password))) return null;

          // Create Tokens
          const { accessToken, refreshToken } = createToken(user);

          console.log(cookieConfig);
          console.log(process.env.COOKIE_LIVE);

          res.cookie("accessToken", accessToken, cookieConfig);
          res.cookie("refreshToken", refreshToken, cookieConfig);

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
      // If has no User
      if (!req.userId) return false;

      // Verify the User
      const user = await User.findOne({ _id: req.userId });

      if (!user) return false;

      // Delete the Tokens
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
