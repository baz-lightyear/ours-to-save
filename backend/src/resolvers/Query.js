const { forwardTo } = require('prisma-binding');

const Query = {
    stories: forwardTo('db')
};

module.exports = Query;
