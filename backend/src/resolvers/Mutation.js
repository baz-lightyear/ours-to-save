const Mutation = {
    async createStory(parent, args, ctx, info) {
        const story = await ctx.db.mutation.createStory(
            {
                data: {
                    ...args,
                },
            },
            info
        );
        return story;
    }

};

module.exports = Mutation;
