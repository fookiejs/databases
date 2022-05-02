import { DynamoDBClient, CreateTableCommand, PutCommand } from "@aws-sdk/client-dynamodb";
module.exports = async function (ctx) {
    const setting = ctx.local.get("setting", "dynamodb_connection").value
    const ddbClient = new DynamoDBClient({ region: setting.region });

    const database = {
        name: "dynomodb",
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
            const params = {
                AttributeDefinitions: [],
                KeySchema: [],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
                TableName: model.name, //TABLE_NAME
                StreamSpecification: {
                    StreamEnabled: false,
                },
            };
            await ddbClient.send(new CreateTableCommand(params));

            model.methods.read = async function (payload, ctx, state) {
                let res = await MDL.findAll({
                    where: payload.query.filter,
                    attributes: payload.query.attributes,
                    limit: payload.projection.limit,
                    offset: payload.projection.offset,
                });
                payload.response.data = res;
            }
            model.methods.create = async function (payload, ctx, state) {
                const res = await ddbClient.send(new PutCommand({
                    TableName: model.name,
                    Item: payload.body
                }));
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