module.exports.mongodb = async function (ctx) {
    await ctx.use(require('./src/database/mongodb.js'));

}

module.exports.pg = async function (ctx) {
    await ctx.use(require('./src/database/pg.js'));
}

