module.exports = async function (ctx) {
    const setting = ctx.local.get("setting", "dynamodb_connection").value

    const database = {
        name: "cassandradb",
        types: {
            any: {
                controller: () => true
            },
            string: {
                controller: ctx.lodash.isString
            },
            number: {
                controller: ctx.lodash.Number
            },
            boolean: {
                controller: ctx.lodash.isBoolean
            },
            object: {
                controller: ctx.lodash.isObject
            },
        },
        pk: "id",
        connect: async function (config) { },
        disconnect: async function (config) { },
        modify: async function (model) {


            model.methods.read = async function (payload, ctx, state) {
            }
            model.methods.create = async function (payload, ctx, state) {
            }
            model.methods.delete = async function (payload, ctx, state) {
            }
            model.methods.update = async function (payload, ctx, state) {
            }
            model.methods.count = async function (payload, ctx, state) {
            }
        }
    }

    await ctx.database(database)
}