const mongoose = require("mongoose")
const map = {
    any: mongoose.Schema.Types.Mixed,
    _id: mongoose.Schema.Types.ObjectId,
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


    let res = await ctx.database({
        name: "mongodb",
        pk: "_id",
        types: ["any", "_id", "object", "string", "number", "boolean", "array"],
        connect: async function (setting) {
            await mongoose.connect(setting.url);
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
                if (!ctx.lodash.keys(this.types).includes(model.schema[f].type)) {
                    throw Error(`Invalid Type: ${model.schema[f].type} Model: ${model.name}`);
                }
                schema[f].type = map[model.schema[f].type]
            }
            let Model = mongoose.model(model.name, new mongoose.Schema(schema, { versionKey: false }));

            model.methods.read = async function (payload, ctx, state) {
                let res = await Model.find(payload.query.filter, payload.query.attributes, payload.query.projection).lean();
                payload.response.data = res;
            }
            model.methods.create = async function (payload, ctx, state) {
                let res = await Model.create(payload.body);
                payload.response.data = ctx.lodash.pick(res, payload.query.attributes)
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
    console.log(res);
}