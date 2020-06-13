const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');



const Mutation = {
    async createStory(parent, args, ctx, info) {

        const geocodingApiKey = 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw'

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
        const geocodingApiKey = 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw'

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
                    approved: false
                },
            },
            info
        );
        return feature;
    },
    async createUser(parent, args, ctx, info) {
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                },
            },
            info
        );
        return user;
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password: password,
                permissions: {set: ['USER']},
            },
        }, info);
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
          // sameSite: 'none',
          // secure: true ,
        });
        // sgMail.setApiKey(process.env.SENDGRID_API);
        // const msg = {
        //   to: `${user.email}`,
        //   from: 'sayhello@sayplants.com',
        //   subject: 'Welcome to SayPlants',
        //   text: 'Welcome to SayPlants',
        //   template_id: "d-2fd1d523ae4a4c258429f412d2a58900",
        //   html: "Welcome to SayPlants",
        // };
        // sgMail.send(msg).catch(err => console.log(err.response.body))
        return user
      },
      async signin(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
          throw new Error(`No user found for email ${email}`);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error('Invalid Password!');
        }
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
          // sameSite: 'none',
          // secure: true
        });
        return user;
      },
      signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token', {
          // sameSite: 'none',
          // secure: true
        });
        return { message: 'Goodbye!' };
      },
      async requestReset(parent, args, ctx, info) {
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
          throw new Error(`No such user found for email ${args.email}`);
        }
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
          where: { email: args.email },
          data: { resetToken, resetTokenExpiry },
        });
        // sgMail.setApiKey(process.env.SENDGRID_API);
        //   const msg = {
        //     to: `${user.email}`,
        //     from: 'marcus.rapacioli@gmail.com',
        //     subject: 'Password reset link',
        //     text: 'Password reset link',
        //     html: `Please click on the link to reset your password 👌
        //     \n\n
        //     <a href="${process.env
        //       .FRONTEND_URL}/reset?resetToken=${resetToken}">Reset password</a>`,
        //   };
        //   sgMail.send(msg);
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
          throw new Error('This token is either invalid or expired!');
        }
        const password = await bcrypt.hash(args.password, 10);
        const updatedUser = await ctx.db.mutation.updateUser({
          where: { email: user.email },
          data: {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
          // sameSite: 'none',
          // secure: true
        });
        return updatedUser;
      },
};

module.exports = Mutation;
