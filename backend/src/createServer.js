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
    const customer = await stripe.customers.retrieve(session.customer)
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
        
        // 1.4 if the user was referred by someone, then give the referrer credit in stripe
        user = await db.query.user( {where: {stripeCustomerId: customerId}}, '{id, permissions, stripeCustomerId, email, name, referredBy {id, stripeCustomerId, email, name}}').catch(err => {console.log(err)})
        if (user && user.referredBy) {
          await stripe.customers.createBalanceTransaction(
            user.referredBy.stripeCustomerId,
            {
              amount: -500,
              currency: 'gbp',
            }
          );
          // 1.4.1 send an emails to referrer to confirm that credit was received
          const referrerMessage = {
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
          sgMail.send(referrerMessage).catch(err => console.log(err.response.body))
        }
      }
      // Is the product a gift subscription?
      if (productId === "prod_IUxBIIVOWbZ6sk") {
        // 1. Create a new Gift
        const voucherCodesArray = await voucherCodes.generate({
            length: 7,
            count: 1
        });
        let stripeCouponId = ""
        let subscriptionPriceId = ""
        if (priceId === "price_1HuOTUIcB8KtT8kg0WAes53y" || priceId === "price_1HtxGoIcB8KtT8kgkCuCjQ9g") {
          // £30 off and 6 month subscription
          stripeCouponId = "CTbIeDF3"
          subscriptionPriceId = "price_1HuKSKIcB8KtT8kgtBLDBqjR"
        } else if (priceId === "price_1HuOTDIcB8KtT8kgLPqC3Vie" || priceId === "price_1HuOQtIcB8KtT8kgpPvYZFca") {
          // £50 off and a yearly subscription
          stripeCouponId = "kOOj28wJ"
          subscriptionPriceId = "price_1HdklpIcB8KtT8kgJVP0lRJX"
        }
        const gift = await db.mutation.createGift({
          data: {
            shortId: voucherCodesArray[0],
            stripeGiftPriceId: priceId,
            stripeSubscriptionPriceId: subscriptionPriceId,
            buyerEmail: customer.email,
            stripeCouponId: stripeCouponId,
          }
        })
        // 2. Send an email to the buyer, confirming purchase and a weblink giving special instructions for the gift membership 
        const giftEmail = {
          to: `${customer.email}`,
          from: 'harry@ourstosave.com',
          subject: 'Instructions for setting up Ours to Save gift membership',
          text: 'Thanks for supporting independent journalism',
          template_id: "d-29d7e1ba082042bf8259b88749351243",
          html: "Thanks for supporting independent journalism",
          dynamicTemplateData: {
            voucherCode: `${gift.shortId}`
          },
        }
        sgMail.send(giftEmail).catch(err => console.log(err.response.body))
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

server.express.use('/getReferralPromotionCode', bodyParser.raw({type: 'application/json'}), async (req, res, next) => { 
  if (req.headers.event && req.headers.event === "getReferralPromotionCode") {
    const referralPromotionCode = await stripe.promotionCodes.create({
      coupon: 'ZiwJgPnv',
      customer: req.headers.stripe_customer_id,
      max_redemptions: 1,
    }).catch((err) => console.log(err.message));
    if (referralPromotionCode) {res.set('referral_promotion_code', referralPromotionCode.code)}
  }
  next()
});

server.express.use('/createStripeCheckoutSession', bodyParser.raw({type: 'application/json'}), async (req, res, next) => { 
  const event = req.headers.event
  if (event && event === "createStripeCheckoutSession") {
    const sessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.headers.price_id,
          quantity: 1,
        },
      ],
      success_url: req.headers.success_page,
      cancel_url: `https://www.ourstosave.com`,
      mode: req.headers.mode
    }
    if (req.headers.mode === "subscription") {
      sessionOptions.subscription_data = {trial_from_plan: true}
      sessionOptions.allow_promotion_codes = true 
      sessionOptions.customer = req.headers.stripe_customer_id
    }
    // if you need billing address, add billing address
    if (req.headers.address_instruction && req.headers.address_instruction === 'includeShippingAddress') {
      sessionOptions.shipping_address_collection = {allowed_countries: ["GB"]}
    }
    const session = await stripe.checkout.sessions.create(sessionOptions).catch((err) => console.log(err.message));
    if (session) {res.set('sessionId', session.id)}
  }
  next()
});

server.express.use('/createStripeBillingSession', bodyParser.raw({type: 'application/json'}), async (req, res, next) => { 
  const event = req.headers.event
  if (event && event === "createStripeBillingSession") {
    let billingSession = await stripe.billingPortal.sessions.create({
      customer: req.headers.stripe_customer_id,
      return_url: 'https://www.ourstosave.com/account',
    });
    if (billingSession) {res.set('billingSessionUrl', billingSession.url)}
  }
  next()
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
      exposedHeaders: "sessionId, referral_promotion_code, billingSessionUrl",
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  },
);