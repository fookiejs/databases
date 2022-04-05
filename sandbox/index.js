(async () => {

    const fookie = require("../../core")
    await fookie.init()
    await fookie.setting({
        name: "pg_connection",
        value: {
            host: "127.0.0.1:5432",
            database: "fookie",
            user: "guest",
            password: "guest"
        }
    })
    await fookie.use(require("../").pg)
    await fookie.use(require("../../server"))
    await fookie.listen(3002)

    await fookie.model({
        name: "test_pg",
        database: "pg",
        schema: {
            msg: {
                type: "string",
                required: true
            }
        }
    })

    let res = await fookie.run({
        model: "test_pg",
        method: "read",
        query: {
            filter: {

            }
        }
    })
    console.log(res);
})()