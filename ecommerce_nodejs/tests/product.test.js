const RedisPubSubService = require('../src/services/redis.pubsub.service')

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }
        console.log(`product id is ${productId}`)
        RedisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()