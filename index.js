module.exports.mongodb = async function (ctx) {
    await ctx.use(require('./src/database/mongodb.js'));

}

module.exports.postgresql = async function (ctx) {
    await ctx.use(require('./src/database/postgresql.js'));
}

