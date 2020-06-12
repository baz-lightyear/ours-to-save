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
    }
};

module.exports = Query;
