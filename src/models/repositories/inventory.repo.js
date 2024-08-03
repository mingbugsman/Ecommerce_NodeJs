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

module.exports = {
    insertInventory
}