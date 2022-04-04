const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = function (ctx) {
    const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
        dialect: 'postgres',
    });
    await ctx.database({
        name: "pg",
        types: {},
        pk: "id",
        connect: async function (config) {
        },
        disconnect: async function (config) {
            console.log("sequelize dc");
        },
        modify: async function (model) {
            const User = sequelize.define('User', {
                // Model attributes are defined here
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                lastName: {
                    type: DataTypes.STRING
                    // allowNull defaults to true
                }
            }, {
                // Other model options go here
            });

            // `sequelize.define` also returns the model
            console.log(User === sequelize.models.User); // true

            model.methods.read = async function (payload, ctx, state) {
                let res = await Model.find({
                    where: payload.query,
                    attributes: payload.attributes,
                    limit: payload.options.limit,
                    offset: payload.options.offset,
                });
                return res;
            }
            model.methods.create = async function (payload, ctx, state) {
                let res = await Model.create(payload.body);
                return ctx.lodash.pick(res, payload.attributes)
            }
            model.methods.delete = async function (payload, ctx, state) {
                let res = await Model.destroy({
                    where: payload.query
                });
                return res;
            }
            model.methods.update = async function (payload, ctx, state) {
                return await Model.update(payload.body, {
                    where: payload.query
                });
            }

            model.methods.count = async function (payload, ctx, state) {
                let res = await Model.count({
                    where: payload.query
                });
                return res;
            }
        }
    })
}