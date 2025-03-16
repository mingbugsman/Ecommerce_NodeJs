'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const CheckOutService = require("../services/checkout.service");



class CheckoutController {
    /**
     * @param {*} req 
     * @param {*} res 
     * @param {*} next
     * @method post
     * @url /v1/api/order/review
     * @return {} 
     */
    checkOutReview = async (req,res,next) => {

    // Pass the updated req.body to the service
    console.log(req.body)
        new SuccessResponse({
            message: "Successfully checkout",
            metadata: await CheckOutService.CheckoutReview(req.body)
        }).send(res);
    };
}

 module.exports = new CheckoutController()


 