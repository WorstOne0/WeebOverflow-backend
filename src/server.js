const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const { setRefreshToken } = require("./jwt");

require("dotenv").config();

const startServer = async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    context: ({ req, res }) => ({ req, res }),
  });

  await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  require("./init.js")();

  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        "https://localhost:3000",
        "http://localhost:3000",
        "http://weeboverflow.me",
        "https://weeboverflow.me",
        "http://www.weeboverflow.me",
        "https://www.weeboverflow.me",
      ],
      credentials: true,
    })
  );

  app.use((req, res, next) => setRefreshToken(req, res, next));

  await server.start();

  server.applyMiddleware({ app, cors: false });

  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `Server ready at => http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
};

startServer();
