'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/shopDev'

const testSchema = new mongoose.Schema({name: String})
const testModel = mongoose.model('Test', testSchema)

describe('Mongoose connection', () => {
    let connection;

    beforeAll(async () => {
        connection = await mongoose.connect(connectString)
    })

    // close the connection to mongodb
    afterAll( async () => {
        await connection.disconnect()
    })

    it('should connect to mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a document to the database', async () => {
        const user = new testModel({name: 'Tuan Minh'});
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it('should find a document in the database', async () => {
        const user = await testModel.findOne({name: 'Tuan Minh'})
        expect(user).toBeDefined()
        expect(user.name).toBe('Tuan Minh')
    })
})