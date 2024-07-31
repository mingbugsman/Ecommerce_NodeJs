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

    UnpublishProductByShop = async (req,res,next) => {
        console.log(req.body);
        new SuccessResponse({
            message : 'Successfully Unpublish new Product',
            metadata : await ProductService.UnpublishProductByShop({
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
    findAllProducts = async (req,res,next) => {
        console.log(req.query);
        new SuccessResponse({
            message : "Successfully find all products",
            metadata : await ProductService.findAllProducts(req.query)
        }).send(res)
    }
    findProduct = async (req,res,next) => {
        console.log("this is my params:::",req.params);
        new SuccessResponse({
            message : "Successfully find one products",
            metadata : await ProductService.findProduct({
                product_id : req.params.product_id
            })
        }).send(res)
    }

    getAllDraftsForShop = async ( req, res,next) => {
        new SuccessResponse({
            message : "Successfully get all drafts for shop",
            metadata : await ProductService.findAllDraftsForShop({product_shop : req.user.userId})
        }).send(res);
    }

    getAllPublishForShop = async ( req, res,next) => {
        new SuccessResponse({
            message : "Successfully get all publish for shop",
            metadata : await ProductService.findAllPublishForShop({product_shop : req.user.userId})
        }).send(res);
    }

    getListSearchProduct = async ( req, res,next) => {
        new SuccessResponse({
            message : "Successfully get all list for shop",
            metadata : await ProductService.searchProducts(req.params)
        }).send(res);
    }

    /// END QUERY ///
};

 module.exports = new ProductController()