const mongoose = require("mongoose")
const map = {
    any: mongoose.Schema.Types.Mixed,
    _id: mongoose.Schema.Types.String,
    object: mongoose.Schema.Types.Mixed,
    string: mongoose.Schema.Types.String,
    number: mongoose.Schema.Types.Number,
    boolean: mongoose.Schema.Types.Boolean,
    array: mongoose.Schema.Types.Array,
}
module.exports = async function (ctx) {
    await ctx.type({
        name: "_id",
        controller: function (v) {
            return ctx.lodash.isString
        },
        mocks: ["05040520-cae1-11ec-9d64-0242ac120002"]
    })
    const setting = ctx.local.get("setting", "mongodb_connection").value
    let res = await ctx.database({
        name: "mongodb",
        pk: "_id",
        types: ["_id", "object", "string", "number", "boolean", "array"],
        connect: async function () {
            await mongoose.connect(setting.url)
                .catch(err => console.log(err))
        },
        disconnect: async function () {
            //await mongoose.disconnect();
        },
        modify: async function (model) {
            mongoose.models = {}
            let schema = {};
            for (let f in model.schema) {
                schema[f] = {};
                if (typeof model.schema[f].relation == "string") {
                    model.schema[f].type = "_id";
                }
                if (!this.types.includes(model.schema[f].type)) {
                    throw Error(`Invalid Type: ${model.schema[f].type} Model: ${model.name}`);
                }
                schema[f].type = map[model.schema[f].type]
            }
            let Model = mongoose.model(model.name, new mongoose.Schema(schema, { versionKey: false }));

            model.methods.read = async function (payload, ctx, state) {
                let res = await Model.find(payload.query.filter, ["_id"].concat(payload.query.attributes), payload.query.projection).lean();
                payload.response.data = res.map(function (r) {
                    return {
                        ...r, _id: r._id.toString()
                    }
                })
            }
            model.methods.create = async function (payload, ctx, state) {
                let res = await Model.create(payload.body);
                payload.response.data = ctx.lodash.pick(res, ["_id"].concat(payload.query.attributes))
                payload.response.data._id = payload.response.data._id.toString()
            }
            model.methods.delete = async function (payload, ctx, state) {
                let res = await Model.deleteMany(payload.query.filter);
                payload.response.data = res;
            }
            model.methods.update = async function (payload, ctx, state) {
                payload.response.data = await Model.updateMany(payload.query.filter, payload.body);
            }

            model.methods.count = async function (payload, ctx, state) {
                let res = await Model.countDocuments(payload.query.filter);
                payload.response.data = res;
            }
        }
    })
}