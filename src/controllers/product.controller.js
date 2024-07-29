'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
    createProduct = async (req,res,next) => {
        console.log(req.body);
        new SuccessResponse({
            message : 'Successfully create new Product',
            metadata : await ProductService.createProduct(req.body.product_type,{
                ...req.body, 
                product_shop : req.user.userId
            })
        }).send(res);
    }
    publishProductByShop = async (req,res,next) => {
        console.log(req.body);
        new SuccessResponse({
            message : 'Successfully publish new Product',
            metadata : await ProductService.publishProductByShop({
                product_id : req.params.id,
                product_shop : req.user.userId
            })
        }).send(res);
    }

    ////QUERY

    /**
     * @desc get all drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @param {JSON} res 
     */
    getAllDraftsForShop = async ( req, res,next) => {
        new SuccessResponse({
            message : "Successfully get all drafts for shop",
            metadata : await ProductService.findAllDraftsForShop({product_shop : req.user.userId})
        }).send(res);
    }

    getAllPulishForShop = async ( req, res,next) => {
        new SuccessResponse({
            message : "Successfully get all drafts for shop",
            metadata : await ProductService.findAllPublishForShop({product_shop : req.user.userId})
        }).send(res);
    }


    /// END QUERY ///
};

 module.exports = new ProductController()