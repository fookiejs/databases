(async () => {

    const fookie = require("../../core")
    await fookie.init()
    /*
    await fookie.setting({
        name: "postgresql_connection",
        value: {
           url:`postgres://guest:guest@127.0.0.1/fookie`
        }
    })
    */
    await fookie.setting({
        name: "mongodb_connection",
        value: { url: "mongodb://127.0.0.1/fookie" }
    })
    // await fookie.use(require("../").postgresql)
    await fookie.use(require("../").mongodb)
    await fookie.use(require("../../server"))
    await fookie.listen(3002)

    await fookie.model({
        name: "test_db",
        database: "mongodb",
        schema: {
            msg: {
                type: "string",
                required: true
            }
        }
    })



    let res = await fookie.run({
        model: "test_db",
        method: "read",
        query: {
            filter: {
            }
        }
    })
    console.log(res);
})()