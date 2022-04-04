module.exports = async function (ctx) {
    await ctx.use(require('./src/database/mongodb.js'));
    await ctx.use(require('./src/database/sql.js'));
    await ctx.use(require('./src/database/dynomodb.js'));
    await ctx.use(require('./src/database/cassandra.js'));
}
