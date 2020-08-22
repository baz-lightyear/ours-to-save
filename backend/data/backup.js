require('dotenv').config({ path: 'variables.env' });
const { Prisma } = require('prisma-binding');
const fs = require('fs');
var mkdirp = require('mkdirp');


const devDatabase = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: "https://eu1.prisma.sh/harrykingdon/demo/dev",
    secret: "qwertyuiop",
    debug: false,
});

const prodDatabase = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: "https://ours-to-save-prod-e8112953ab.herokuapp.com",
    secret: "qwertyuiop",
    debug: false,
});

const backup = async () => {
    const stories = await prodDatabase.query.stories().catch(err => console.log(err))
    const features = await prodDatabase.query.features().catch(err => console.log(err))
    const users = await prodDatabase.query.users().catch(err => console.log(err))
    const featureComments = await prodDatabase.query.featureComments().catch(err => console.log(err))
    const storyComments = await prodDatabase.query.storyComments().catch(err => console.log(err))
    const date = new Date()
    mkdirp(`data/backup_${date}`).then(made => {
        console.log(`made directory: ${made}`)
        fs.writeFile(`data/backup_${date}/stories.json`, JSON.stringify(stories), (err) => {
            if (err) throw err;
        });
        fs.writeFile(`data/backup_${date}/features.json`, JSON.stringify(features), (err) => {
            if (err) throw err;
        });
        fs.writeFile(`data/backup_${date}/users.json`, JSON.stringify(users), (err) => {
            if (err) throw err;
        });
        fs.writeFile(`data/backup_${date}/featureComment.json`, JSON.stringify(featureComments), (err) => {
            if (err) throw err;
        });
        fs.writeFile(`data/backup_${date}/storyComment.json`, JSON.stringify(storyComments), (err) => {
            if (err) throw err;
        });
    })
}

backup()

// const read = () => {
//     fs.readFile('data/backup_Sun May 24 2020 22:26:41 GMT+0100 (British Summer Time)/stories.json', (err, data) => {
//         if (err) throw err;
//         const stories = data
//         const parsed = JSON.parse(stories)
//         console.log(parsed)
//     });
// }

// read()

