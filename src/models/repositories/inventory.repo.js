const { convertToObjectID } = require("../../utils")
const inventoryModel = require("../inventory.model")



const insertInventory = async({
    productId,shopId,stock, location = "Unknown"
}) => {
    return inventoryModel.create({
        inven_productId : productId, 
        inven_location : location,
        inven_ShopId : shopId,
        inven_stock : stock
    })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId : convertToObjectID(productId),
        inven_stock : {$gte: quantity},
    }, updateSet = {
        $inc : {
            inven_stock : -quantity
        },
        $push : {
            inven_reservations : {
                quantity,
                cartId,
                createOn : new Date()
            }
        }
    },
    options = {upsert: true, new:true}
    return await inventoryModel.updateOne(query, updateSet, options);
}

module.exports = {
    insertInventory,
    reservationInventory
}