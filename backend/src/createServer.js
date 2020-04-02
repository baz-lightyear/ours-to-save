const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding');
require('dotenv').config({ path: 'variables.env' });
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');


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
    context: req => ({ ...req, db }),
});

// server.start(() => console.log('Server is running on localhost:4000'))