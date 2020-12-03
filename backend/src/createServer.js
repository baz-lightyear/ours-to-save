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
const voucherCodes = require('voucher-code-generator');



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
    sgMail.setApiKey(process.env.SENDGRID_API);
    // If checkout.session.completed, then either we have a new subscription, or someone bought a gift (one-off purchase)
    // First we test to see which product they bought
    const session = event.data.object
    const customer = stripe.customers.retrieve(session.customer)
    stripe.checkout.sessions.listLineItems(session.id, { limit: 5 }, async (err, lineItems) => {
      const productId = lineItems.data[0].price.product
      const priceId = lineItems.data[0].price.id
      
      // Is the product an ongoing subscription?
      if (productId === "prod_Hnaem0Bw2rh4Oy") {
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
              amount: -500,
              currency: 'gbp',
            }
          );
          await stripe.customers.createBalanceTransaction(
            user.referredBy.stripeCustomerId,
            {
              amount: -500,
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
      // Is the product a gift subscription?
      if (productId === "prod_IUxBIIVOWbZ6sk") {
        // 1. Create a new Gift
        const voucherCodes = voucherCodes.generate({
            length: 7,
            count: 1
        });
        let stripeCouponId = ""
        if (priceId === "price_1HtxGoIcB8KtT8kgkCuCjQ9g") {
          // £30 off
          stripeCouponId = "CTbIeDF3"
        } else if (priceId === "price_1HtxGoIcB8KtT8kgC1UHUCRQ") {
          // £50 off
          stripeCouponId = "kOOj28wJ"
        }
        await db.mutation.createGift({
          data: {
            shortId: voucherCodes[0],
            stripePriceId: priceId,
            buyerEmail: customer.email,
            stripeCouponId: stripeCouponId,
          }
        })
        // 2. Send an email to the buyer, confirming purchase and a weblink giving special instructions for the gift membership 
        const giftEmail = {
          to: `${customer.email}`,
          from: 'harry@ourstosave.com',
          subject: ``,
          text: '',
          template_id: "",
          html: "",
          dynamicTemplateData: {
            voucherCode: `${voucherCodes[0]}`
          },
        }
        sgMail.send(giftEmail).catch(err => console.log(err.response.body))
        // 2. 
      }
    })
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

server.express.use('/createStripeCheckoutSession', bodyParser.raw({type: 'application/json'}), async (req, res, next) => { 
  const event = req.headers.event
  if (event && event === "createStripeCheckoutSession") {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.headers.price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // the success and cancel urls have to be dynamic. have they come from the redemption page, gift page or account page?
      success_url: `https://www.ourstosave.com/gift_success`,
      cancel_url: `https://www.ourstosave.com/gift`,
    }).catch((err) => console.log(err.message));
    if (session) {res.set('sessionId', session.id)}
  }
  next()
})


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
      exposedHeaders: "sessionId"
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  },
);