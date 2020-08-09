const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding');
require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const bodyParser = require('body-parser');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const stripe = require('./stripe');


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

// stripe webhooks



const stripeWebhookKey = process.env.STRIPE_WEBHOOK_KEY;

server.express.use('/stripe/webhooks', bodyParser.raw({type: 'application/json'}), async (req, res, next) => { 
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookKey);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // 1. checkout.session.completed when they successfully set up a subscription
  if (event.type === 'checkout.session.completed') {
    // 1.1 find the user
    const customerId = event.data.object.customer
    const user = await db.query.user( {where: {stripeCustomerId: customerId}}, '{id, permissions}').catch(err => {console.log(err)})
    // 1.2. update the user's permissions with "PREMIUM"
    const newPermissions = user.permissions.filter(p => p !== "PREMIUM")
    newPermissions.push('PREMIUM')
    await db.mutation.updateUser(
      { 
        where: {id: user.id},
        data: {
          permissions: {
            set: newPermissions
          }
        }
      }
    ).catch(err => {console.log(err)});
  }
  res.json({received: true});
  res.end()
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
