require('dotenv').config({ path: 'variables.env' });
const { Prisma } = require('prisma-binding');
const fs = require('fs');
const fetch = require('node-fetch');


const prodDatabase = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: "https://ours-to-save-prod-e8112953ab.herokuapp.com",
    secret: "qwertyuiop",
    debug: false,
});

const backfill = async () => {
    const geocodingApiKey = 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw'
    const stories = await prodDatabase.query.stories()
    // for each story
    stories.filter(story => !story.country && story.title !== "Snow Leopard Conservation Trust, India").forEach(async story => {
        const country = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${story.address}&key=${geocodingApiKey}`)
        .then(response => response.json())
        .then(data => {
            return data.results[0].address_components.filter(e => e.types.includes('country'))[0].long_name
        })
        await prodDatabase.mutation.updateStory({
            data: {
                country: country
            },
            where: {
                id: story.id
            }
        })
    })
}

backfill()

// const read = () => {
//     fs.readFile('data/backup_Sun May 24 2020 22:26:41 GMT+0100 (British Summer Time)/stories.json', (err, data) => {
//         if (err) throw err;
//         const stories = data
//         const parsed = JSON.parse(stories)
//         console.log(parsed)
//     });
// }

// read()

