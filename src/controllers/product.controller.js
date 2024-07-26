'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
    createProduct = async (req,res,next) => {
        console.log(req.body);
        new SuccessResponse({
            message : 'Successfully create new Product',
            metadata : await ProductService.createProduct(req.body.product_type,req.body)
        }).send(res);
    }
};

module.exports = new ProductController()