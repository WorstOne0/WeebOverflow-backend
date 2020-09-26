const { ApolloServer, ApolloError } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const User = require("./models/User");

const { setRefreshToken } = require("./jwt");

require("dotenv").config();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = express();
  app.use(cookieParser());

  app.use((req, res, next) => setRefreshToken(req, res, next));

  server.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at => http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
