'use strict'

const { BadRequestError } = require('../middleware/core/error.response');
const inventoryModel = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '146, Nguyen Thi Rang, HCM City'
    }) {
        const product = await getProductById(productId);
        if (!product) throw new BadRequestError('The product does not exists');
        
        const query = {inven_shopId : shopId, inven_productId : productId};
        const updateSet = {
            $inc : {
                inven_stock:stock
            },
            $set : {
                inven_location: location
            }
        };
        const options = {upsert:true, new:true};
        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;