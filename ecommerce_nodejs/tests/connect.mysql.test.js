const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    port: '8822',
    user: 'root',
    password: '123456',
    database: 'shopDev'
})


const batchSize = 100000 // adjust batch size
const totalSize = 10_000_000 // adjust total size

console.time('::::::::::TIME:::::::::::')

let currentId = 1;
const insertBatch = async () => {
    const values = [];
    for (let index = 0; index < batchSize && currentId <= totalSize; index++) {
        const name = `name-${currentId}`
        const age = currentId;
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++;
    }

    if (!values.length) {
        console.time('::::::::::TIME:::::::::::')
        pool.end(err => {
            if (err) console.log(err)
            else  console.log(`connection closed`)
         })
    }

    const sql = `INSERT INTO users (id, name, age, address) VALUES ?`

    pool.query(sql,[values], async function (err,result) {
        if (err) throw err
        console.log(`query results:`, result);
        console.log(`Inserted ${result.affectedRows} records`)
        await insertBatch()
    })
}


insertBatch().catch(err => console.error(err))


// pool.query('SELECT * FROM users', function (err,result) {
//     if (err) throw err
//     console.log(`query results:`, result);

//     pool.end(err => {
//         if (err) throw err;
//         console.log(`connection closed`)
//     })
// })