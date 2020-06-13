const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding');
require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const bodyParser = require('body-parser');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false,
});

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers: {
    Mutation,
    Query,
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: req => ({ ...req, db }),
});

server.express.use(cookieParser());
server.express.use(bodyParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }
  next();
});

// redirect http to https ⬇️

server.express.use(bodyParser.json({ limit: '10mb' }));
server.express.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  },
);
