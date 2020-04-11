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
    }
};

module.exports = Query;
