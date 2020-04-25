const fetch = require('node-fetch');

const Mutation = {
    async createStory(parent, args, ctx, info) {

        const geocodingApiKey = 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw'

        const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${args.address}&key=${geocodingApiKey}`)
        .then(response => response.json())
        .then(data => {
            return data.results[0].geometry.location 
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
                    approved: false
                },
            },
            info
        );
        return story;
    },
    async createFeature(parent, args, ctx, info) {
        const feature = await ctx.db.mutation.createFeature(
            {
                data: {
                    ...args,
                    approved: false
                },
            },
            info
        );
        return feature;
    }
};

module.exports = Mutation;
