const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');
const stripe = require('../stripe');
const { once } = require('process');
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
          alwaysFree: args.alwaysFree
        },
      },
      info
    );
    return feature;
  },

  async addToMailingList(parent, args, ctx, info) {
    const existingUser = await ctx.db.query.user({
      where: {email: args.email}
    })
    if (existingUser) {
      throw new Error(`That email is already signed up!`)
    } else {
      // format data
      const formattedName = args.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      args.email = args.email.toLowerCase();
      // create user
      let user = await ctx.db.mutation.createUser({
        data: {
            email: args.email,
            name: formattedName,
            permissions: {set: ['MAILING_LIST']},
        },
      }, info);
      console.log('created user')

      return user
    }
  },

  async signup(parent, args, ctx, info) {

    // handle users that have an email because they're on the mailing list, but no login credentials
    const existingUser = await ctx.db.query.user({
      where: {email: args.email}
    })
    if (existingUser) {
      // is there a password? if so, throw following error
      if (existingUser.password) {
        throw new Error("An account is already associated with that email")
      } else {
        // if there's no password, then encrypt the password, and update the user with the password   
        
        // format data
        const formattedName = args.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        const password = await bcrypt.hash(args.password, 10);
        const token = jwt.sign({ userId: existingUser.id }, process.env.APP_SECRET);

        // update user
        let user = await ctx.db.mutation.updateUser({
          where: {id: existingUser.id},
          data: {
              name: formattedName,
              password: password,
              permissions: {set: ['USER']},
              cookieToken: token
          },
        }, info);

        // send confirmation email
        sgMail.setApiKey(process.env.SENDGRID_API);
        const msg = {
          to: `${user.email}`,
          from: 'harry@ourstosave.com',
          subject: 'Welcome to Ours to Save',
          template_id: "d-5d2a5df5c312417c95dbf77512417531",
          html: "Welcome to Ours to Save",
          dynamicTemplateData: {
            firstName: `${user.name.split(" ")[0]}`
          },
        };
        sgMail.send(msg).catch(err => console.log(err.response.body))

        return user
      }
    } else {
      // format data
      const formattedName = args.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      args.email = args.email.toLowerCase();
      const password = await bcrypt.hash(args.password, 10);
  
      // create user
      let user = await ctx.db.mutation.createUser({
          data: {
              email: args.email,
              name: formattedName,
              password: password,
              permissions: {set: ['USER']},
          },
      }, info);
  
      // assign cookie
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      user = await ctx.db.mutation.updateUser({
        where: {id: user.id},
        data: {cookieToken: token}
      })
  
      // send confirmation email
      sgMail.setApiKey(process.env.SENDGRID_API);
      const msg = {
        to: `${user.email}`,
        from: 'harry@ourstosave.com',
        subject: 'Welcome to Ours to Save',
        template_id: "d-5d2a5df5c312417c95dbf77512417531",
        html: "Welcome to Ours to Save",
        dynamicTemplateData: {
          firstName: `${user.name.split(" ")[0]}`
        },
      };
      sgMail.send(msg).catch(err => console.log(err.response.body))
  
      return user
    }

  },

  async signin(parent, { email, password }, ctx, info) {
    let user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }

    // if the user has an email but no password, tell them they need to sign up
    if (!user.password) {
      throw new Error(`Hi ${user.name} - we have your email but you haven't created an account yet. You'll need to sign up for access to Ours to Save.`)
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Incorrect password');
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
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
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
        alwaysFree: args.alwaysFree
      }
    })
    return feature
  },

  async createStripeCustomer(parent, args, ctx, info) {
    let user = await ctx.db.query.user({where: {id: args.userId}})
    if (!user.stripeCustomerId) {
      let customer = await stripe.customers.create({email: user.email})
      user = await ctx.db.mutation.updateUser({
        where: {id: user.id},
        data: {stripeCustomerId: customer.id,}
      })
    }
    return user
  },

  async updateReferrer(parent, args, ctx, info) {
    let referred = ctx.db.mutation.updateUser({
      where: {id: args.referredId},
      data: {referredBy: {connect: {id: args.referrerId}}}
    })
    // we also want to generate a stripe customer if there is none already. We can't just rely on doing in in the usual way because we need there to be one when we create the customer-facing promotion code.
    if (!referred.stripeCustomerId) {
      let customer = await stripe.customers.create({email: referred.email})
      referred = await ctx.db.mutation.updateUser({
        where: {id: args.referredId},
        data: {stripeCustomerId: customer.id,}
      })
    }
    return referred
  },

  async verifyGiftVoucher(parent, args, ctx, info) {
    const gift = await ctx.db.query.gift({where: {shortId: args.voucherCode}})
    let user = await ctx.db.query.user({where: {id: args.userId}})
    // normally we'd create the stripe customer in the create stripe customer method above, but here we create a stripe customer if one doesn't already exist
    if (!user.stripeCustomerId) {
      let customer = await stripe.customers.create({email: user.email})
      user = await ctx.db.mutation.updateUser({
        where: {id: user.id},
        data: {stripeCustomerId: customer.id,}
      })
    }
    if (gift) {
      if (gift.redeemed) {
        throw new Error("Sorry, that gift voucher has already been redeemed. If you have any questions, get in touch.")
      } else {
        // generate special stripe code
        const stripePromotionCode = await stripe.promotionCodes.create({
          coupon: gift.stripeCouponId,
          customer: user.stripeCustomerId,
          max_redemptions: 1,
        })
        // attach the stripePromotionCode to the gift, attach the user and set 'redeemed' to true
        const updatedGift = await ctx.db.mutation.updateGift({
          where: {id: gift.id},
          data: {
            redeemed: true,
            redeemedBy: {connect: {id: args.userId}},
            stripePromotionCode: stripePromotionCode.code,
          }
        })
        return updatedGift
      }
    } else {
      throw new Error("We can't find a gift voucher matching that code. Please try again or get in touch.")
    }
  }
}

module.exports = Mutation;
