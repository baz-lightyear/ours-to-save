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
const sgMail = require('@sendgrid/mail');


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
  if (event.type === 'checkout.session.completed') {
    // 1.1 find the user
    const customerId = event.data.object.customer
    let user = await db.query.user( {where: {stripeCustomerId: customerId}}, '{id, permissions, stripeCustomerId, name, email, referredBy {id, stripeCustomerId}}').catch(err => {console.log(err)})
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
    // 1.3 send welcome email
    sgMail.setApiKey(process.env.SENDGRID_API);
    const msg1 = {
      to: `${user.email}`,
      from: 'harry@ourstosave.com',
      subject: `Ours to Save membership`,
      text: 'Welcome to Ours to Save membership',
      template_id: "d-7e434461477145ce88ab1d250c3ab869",
      html: "Welcome to Ours to Save membership",
      dynamicTemplateData: {
        firstName: `${user.name.split(" ")[0]}`,
        sharingCode: `<a href="https://www.ourstosave.com/referred?userId=${user.id}">https://www.ourstosave.com/referred?userId=${user.id}</a>`
      },
    }
    sgMail.send(msg1).catch(err => console.log(err.response.body))
    
    // 1.4 if the user was referred by someone, then give them both credit in stripe
    user = await db.query.user( {where: {stripeCustomerId: customerId}}, '{id, permissions, stripeCustomerId, email, name, referredBy {id, stripeCustomerId, email, name}}').catch(err => {console.log(err)})
    if (user && user.referredBy) {
      await stripe.customers.createBalanceTransaction(
        user.stripeCustomerId,
        {
          amount: -300,
          currency: 'gbp',
        }
      );
      await stripe.customers.createBalanceTransaction(
        user.referredBy.stripeCustomerId,
        {
          amount: -300,
          currency: 'gbp',
        }
      );
      // 1.4.1 send two emails to confirm that credit was received
      const msg2 = {
        to: `${user.email}`,
        from: 'harry@ourstosave.com',
        subject: 'You earned referral credit',
        text: 'You earned referral credit',
        template_id: "d-7bfbb2608d6f412da19d39fca0e02d64",
        html: "You earned referral credit",
        dynamicTemplateData: {
          firstName: `${user.name.split(" ")[0]}`,
          referredBy: `${user.referredBy.name}`,
          sharingCode: `<a href="https://www.ourstosave.com/referred?userId=${user.id}">https://www.ourstosave.com/referred?userId=${user.id}</a>`
        },
      }
      sgMail.send(msg2).catch(err => console.log(err.response.body))
      const msg3 = {
        to: `${user.referredBy.email}`,
        from: 'harry@ourstosave.com',
        subject: 'You earned referral credit',
        text: 'You earned referral credit',
        template_id: "d-1c56c88c04114f31ae63c795f4d34b4c",
        html: "You earned referral credit",
        dynamicTemplateData: {
          firstName: `${user.referredBy.name.split(" ")[0]}`,
          referred: `${user.name}`,
          sharingCode: `<a href="https://www.ourstosave.com/referred?userId=${user.referredBy.id}">https://www.ourstosave.com/referred?userId=${user.referredBy.id}</a>`

        },
      }
      sgMail.send(msg3).catch(err => console.log(err.response.body))
    }
  }
  // 2. customer.subscription.deleted when a subscription is cancelled
  if (event.type === 'customer.subscription.deleted') {
    // 2.1. We need to get the customer id from the subscription and fetch the user
    const subscription = event.data.object
    const customerId = subscription.customer
    const user = await db.query.user( {where: {stripeCustomerId: customerId}}, '{id, permissions}').catch(err => {console.log(err)})
    // 2.2. Update user permissions to exclude 'premium'
    const newPermissions = user.permissions.filter(p => p !== "PREMIUM")
    await db.mutation.updateUser({
      where: {id: user.id},
      data: {
        permissions: {
          set: newPermissions
        }
      }
    }) 
  }
  // 3. customer.subscription.updated when their credit changes because of an invoice or added credit
  if (event.type === "customer.updated") {
    const customer = event.data.object
    await db.mutation.updateUser({
      where: {stripeCustomerId: customer.id},
      data: {
        stripeCustomerBalance: customer.balance
      }
    })
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