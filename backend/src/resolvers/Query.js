const { forwardTo } = require('prisma-binding');
const jwt = require('jsonwebtoken');

const Query = {
    async mapStories(parent, args, ctx, info) {
        const mapStories = await ctx.db.query.stories({orderBy: 'createdAt_DESC', first: args.first})
        return mapStories
    },
    features: forwardTo('db'),
    async story(parent, args, ctx, info) {
        const story = await ctx.db.query.story(
                {
                    where: { id: args.id },
                },
                info
            );
        return story
    },
    async feature(parent, args, ctx, info) {
        const feature = await ctx.db.query.feature(
                {
                    where: { id: args.id },
                },
                info
            );
        return feature
    },
    async moreStories(parent, args, ctx, info) {
        if (args.cursor) {
            const moreStories = await ctx.db.query.stories(
                {
                    where: { approved: true },
                    orderBy: args.orderBy,
                    after: args.cursor,
                    first: 5
                },
                info
            )
            return moreStories
        } else {
            const moreStories = await ctx.db.query.stories(
                {
                    where: { approved: true },
                    orderBy: args.orderBy,
                    first: 5
                },
                info
            )
            return moreStories           
        }
    },
    async latestFeature(parent, args, ctx, info) {
        const latestFeature = await ctx.db.query.features(
            {
                first: 1,
                where: {approved: true},
                orderBy: args.orderBy
            },
            info
        )
        return latestFeature[0]
    },
    async feedPreview(parent, args, ctx, info) {
        const latestStories = await ctx.db.query.stories(
            {
                where: {approved: true},
                orderBy: args.orderBy,
                first: 6
            },
            info
        )
        return latestStories
    },
    async categoryFeatures(parent, args, ctx, info) {
        const features = await ctx.db.query.features(
            {
                where: {approved: true, category: args.category},
                orderBy: args.orderBy, 
            },
            info
        )
        return features
    },
    async recentFeatures(parent, args, ctx, info) {
        const features = await ctx.db.query.features(
            {
                where: {approved: true},
                orderBy: args.orderBy, 
                first: 3,
                skip: 1
            },
            info
        )
        return features
    },
    async boostedFeatures(parent, args, ctx, info) {
        const features = await ctx.db.query.features(
            {
                where: {approved: true, leading: true},
                orderBy: args.orderBy, 
                first: 3,
            },
            info
        )
        return features
    },
    async me(parent, args, ctx, info) {
        if(!args.token) {
            return null;
        } else {
            const { userId } = jwt.verify(args.token, process.env.APP_SECRET)
            const user = await ctx.db.query.user({
                where: { id: userId }
            }, info);
            return user
        }
    },
    async mailingList(parent, args, ctx, info) {
        let users = await ctx.db.query.users(
            {},
            `{id, name, createdAt, stripeCustomerId, stripeCustomerBalance, referredBy { id }, permissions, email}`
        )
        users = users.filter(user => !user.permissions.includes("UNSUBSCRIBED"))
        return users
    },
    async recommendedFeatures(parent, args, ctx, info) {
        const features = await ctx.db.query.features(
            {
                where: {approved: true},
                orderBy: args.orderBy, 
                first: 50
            },
            info
        )
        // remove the article itself from the array
        const filteredFeatures = features.filter(feature => feature.id != args.featureId)
        // pick the latest feature (or second-latest, if the article itself is the latest feature)
        let recommendedFeatures = [filteredFeatures[0]]
        filteredFeatures.shift()

        // if there are more than one recommended feature, randomly select n features and add to the array
        function getRandom(arr, n) {
            var result = new Array(n),
                len = arr.length,
                taken = new Array(len);
            if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = arr[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            return result;
        }
        if (args.count > 1) {
            getRandom(filteredFeatures, args.count).forEach(element => {
                recommendedFeatures.push(element)
            }) 
        }
        return recommendedFeatures
    },
};

module.exports = Query;
