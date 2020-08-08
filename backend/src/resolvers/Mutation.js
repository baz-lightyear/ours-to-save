const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');
const stripe = require('../stripe');
const geocodingApiKey = 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw'

const Mutation = {
  async createStory(parent, args, ctx, info) {
    const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${args.address}&key=${geocodingApiKey}`)
    .then(response => response.json())
    .then(data => {
      const object = data.results[0].geometry.location 
      if (data.results[0].address_components.filter(e => e.types.includes('country'))[0]) {
        object.country = data.results[0].address_components.filter(e => e.types.includes('country'))[0].long_name
      }
      return object
    })
    if (args.author === "") {
      args.author = "Anonymous"
    }
    const story = await ctx.db.mutation.createStory(
      {
        data: {
          ...args,
          longitude: location.lng,
          latitude: location.lat,
          country: location.country,
          approved: false
        },
      },
      info
    );
    return story;
  },

  async createFeature(parent, args, ctx, info) {
    const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${args.address}&key=${geocodingApiKey}`)
    .then(response => response.json())
    .then(data => {
      return data.results[0].geometry.location 
    })
    const feature = await ctx.db.mutation.createFeature(
      {
        data: {
          content: args.content,
          longitude: location.lng,
          latitude: location.lat,
          title: args.title,
          subtitle: args.subtitle,
          bio: args.bio,
          author: args.author,
          category: args.category,
          approved: false,
          featuredImage: args.featuredImage,
        },
      },
      info
    );
    return feature;
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    let user = await ctx.db.mutation.createUser({
        data: {
            ...args,
            password: password,
            permissions: {set: ['USER']},
        },
    }, info);
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    user = await ctx.db.mutation.updateUser({
      where: {id: user.id},
      data: {cookieToken: token}
    })
    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    let user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    user = await ctx.db.mutation.updateUser({
      where: {id: user.id},
      data: {cookieToken: token}
    })
    return user;
  },
  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry },
    });
    sgMail.setApiKey(process.env.SENDGRID_API);
    const msg = {
      to: `${user.email}`,
      from: 'hello@ourstosave.com',
      subject: 'Password reset link',
      text: 'Password reset link',
      html: `Please click on the link to reset your password 🔐
        \n\n
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Reset password</a>`,
      };
    sgMail.send(msg).catch(err => console.log(err.response));
    return { message: 'Thanks!' };
  },
  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Your passwords don't match");
    }
    console.log('looking for user....')
    console.log(`token: ${args.resetToken}`)
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    console.log(user)
    if (!user) {
      throw new Error('This token is either invalid or expired');
    }
    const password = await bcrypt.hash(args.password, 10);
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
        cookieToken: token
      },
    });
    return updatedUser;
  },
  async upvoteStory(parent, args, ctx, info) {
    const user = await ctx.db.query.user(
      {where: { id: args.userId}},
      `{upvotedStories { id }}`
    )
    const story = await ctx.db.query.story({
      where: { id: args.storyId}
    })
    if (user.upvotedStories.map(s => s.id).includes(args.storyId)) {
      console.log('already voted')
      return story
    } else {
      // array of objects with id and story id
      const arrayOfObjects = user.upvotedStories.map(s => {
        const object = new Object()
        object.id = s.id
        return object
      })
      arrayOfObjects.push({id: args.storyId})
      await ctx.db.mutation.updateUser({
        where: {id: args.userId},
        data: { upvotedStories: {set: arrayOfObjects} }
      })
      const newScore = story.countUpvotes + 1
      const updatedStory = await ctx.db.mutation.updateStory({
        where: { id: args.storyId },
        data: { countUpvotes: newScore },
      })
      return updatedStory
    }
  },

  async addFeatureComment(parent, args, ctx, info) {
    const featureComment = await ctx.db.mutation.createFeatureComment({
      data: {
        author: {connect: {id: args.authorId}},
        content: args.content,
        feature: {connect: {id: args.featureId}}
      }
    })
    return featureComment
  },

  async addStoryComment(parent, args, ctx, info) {
    const storyComment = await ctx.db.mutation.createStoryComment({
      data: {
        author: {connect: {id: args.authorId}},
        content: args.content,
        story: {connect: {id: args.storyId}}
      }
    })
    return storyComment
  }, 

  async updateFeature(parent, args, ctx, info) {
    let feature = await ctx.db.query.feature({
      where: {id: args.featureId}
    })
    // CBA to add update address logic yet
    feature = await ctx.db.mutation.updateFeature({
      where: {id: args.featureId},
      data: {
        content: args.content,
        title: args.title,
        subtitle: args.subtitle,
        bio: args.bio,
        author: args.author,
        category: args.category,
        featuredImage: args.featuredImage,
      }
    })
    return feature
  },

  async createStripeCustomerId(parent, args, ctx, info) {
    let user = await ctx.db.query.user({where: {id: args.userId}})
    let customer = await stripe.customers.create({
      email: user.email
    })
    user = await ctx.db.mutation.updateUser(
      {
        where: {id: user.id},
        data: {
          stripeCustomerId: customer.id,
        }
      }, 
    )
    return user
  },

  async createStripeBillingSession(parent, args, ctx, info) {
    let user = await ctx.db.query.user({where: {id: args.userId}})
    let session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: 'https://www.ourstosave.com/account',
    });
    console.log(session)
    user = await ctx.db.mutation.updateUser(
      {
        where: {id: user.id},
        data: {
          stripeBillingSessionUrl: session.url,
        }
      }, 
    )
    return user
  },

  async createStripeSubscription(parent, args, ctx, info) {
    let user = await ctx.db.query.user({where: {id: args.userId}})
    let session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1HDzTTIcB8KtT8kgqNqbhsUJ',
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'https://www.ourstosave.com/account',
      cancel_url: 'https://www.ourstosave.com/account',
    });
    user = await ctx.db.mutation.updateUser(
      {
        where: {id: user.id},
        data: {
          stripeCheckoutSessionId: session.id,
        }
      }, 
    )
    return user
  }
}

module.exports = Mutation;
