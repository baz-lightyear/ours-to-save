const { forwardTo } = require('prisma-binding');

const Query = {
    stories: forwardTo('db'),
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
        if(!ctx.request.userId) {
            return null;
        }
        const user = await ctx.db.query.user({
            where: { id: ctx.request.userId }
        }, info);
        return user
    },
};

module.exports = Query;
