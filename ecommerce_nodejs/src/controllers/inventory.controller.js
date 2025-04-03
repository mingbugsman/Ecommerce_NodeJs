'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const InventoryService = require("../services/inventory.service");



class InventoryController {
    /**
     * @param {*} req 
     * @param {*} res 
     * @param {*} next
     * @method post
     * @url /v1/api/order/review
     * @return {} 
     */
    addStockToInventory = async (req,res,next) => {

    // Pass the updated req.body to the service
    console.log(req.body)
        new SuccessResponse({
            message: "Successfully checkout",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res);
    };
}

 module.exports = new InventoryController()


 