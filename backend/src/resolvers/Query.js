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
    }
};

module.exports = Query;
