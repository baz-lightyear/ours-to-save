require('dotenv').config({ path: 'variables.env' });
const { Prisma } = require('prisma-binding');
const fs = require('fs');
var mkdirp = require('mkdirp');

const prodDatabase = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: "https://ours-to-save-prod-e8112953ab.herokuapp.com",
    secret: "qwertyuiop",
    debug: false,
});

const scrapeEmails = async () => {
    const stories = await prodDatabase.query.stories()
    const users = await prodDatabase.query.users()
    emails = stories.map(story => story.interestedInFeatureEmail)
    users.forEach(user => emails.push(user.email))
    emails = emails.filter(email => email !== "")
    console.log([...new Set(emails)]);
}

scrapeEmails()

