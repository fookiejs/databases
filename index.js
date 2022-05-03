module.exports.mongodb = async function (ctx) {
    await ctx.use(require('./src/database/mongodb.js'));
}

module.exports.postgresql = async function (ctx) {
    await ctx.use(require('./src/database/postgresql.js'));
}

module.exports.dynomodb = async function (ctx) {
    await ctx.use(require('./src/database/dynomodb.js'));
}

module.exports.cassandradb = async function (ctx) {
    await ctx.use(require('./src/database/cassandra.js'));
}
