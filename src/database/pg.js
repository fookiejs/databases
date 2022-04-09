const { Sequelize, DataTypes } = require('sequelize');

module.exports = async function (ctx) {
    let setting = ctx.local.get("setting", "postgresql_connection").value
    const sequelize = new Sequelize(setting.url, {
        define: {
            freezeTableName: true
        }
    })
    await sequelize.authenticate();
    const database = {
        name: "postgresql",
        types: {
            string: {
                type: DataTypes.STRING
            },
            integer: {
                type: DataTypes.INTEGER
            },
            char: {
                type: DataTypes.CHAR
            },
            text: {
                type: DataTypes.TEXT
            },
            bigint: {
                type: DataTypes.BIGINT
            },
            float: {
                type: DataTypes.FLOAT
            },
            real: {
                type: DataTypes.REAL
            },
            double: {
                type: DataTypes.DOUBLE
            },
            decimal: {
                type: DataTypes.DECIMAL
            },
            boolean: {
                type: DataTypes.BOOLEAN
            },
            time: {
                type: DataTypes.TIME
            },
            date: {
                type: DataTypes.DATE
            },
            dateonly: {
                type: DataTypes.DATEONLY
            },
            json: {
                type: DataTypes.JSON
            },
            jsonb: {
                type: DataTypes.JSONB
            },
            blob: {
                type: DataTypes.BLOB
            },
            range: {
                type: DataTypes.RANGE
            },
            uuidv4: {
                type: DataTypes.UUIDV4
            },
        },
        pk: "id",
        connect: async function (config) {
            await sequelize.authenticate();
        },
        disconnect: async function (config) {
            console.log("sequelize dc");
        },
        modify: async function (model) {
            let new_schema = Object.assign({}, model.schema)
            for (let field of ctx.lodash.keys(model.schema)) {
                new_schema[field] = database.types[model.schema[field].type]
            }

            console.log(new_schema);
            const MDL = sequelize.define(model.name, new_schema, {});
            await sequelize.sync({ alter: true });

            model.methods.read = async function (payload, ctx, state) {
                let res = await MDL.findAll({
                    where: payload.query.filter,
                    attributes: payload.query.attributes,
                    limit: payload.query.limit,
                    offset: payload.query.offset,
                });
                payload.response.data = res;
            }
            model.methods.create = async function (payload, ctx, state) {
                let res = await MDL.create(payload.body);
                return ctx.lodash.pick(res, payload.attributes)
            }
            model.methods.delete = async function (payload, ctx, state) {
                let res = await MDL.destroy({
                    where: payload.query
                });
                return res;
            }
            model.methods.update = async function (payload, ctx, state) {
                return await MDL.update(payload.body, {
                    where: payload.query
                });
            }

            model.methods.count = async function (payload, ctx, state) {
                let res = await MDL.count({
                    where: payload.query
                });
                return res;
            }
        }
    }

    await ctx.database(database)
}