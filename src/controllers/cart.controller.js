'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const CartService = require("../services/cart.service");
const { convertToObjectID } = require("../utils");



class CartController {
    /**
     * @param {int} userId
     * @param {*} req 
     * @param {*} res 
     * @param {*} next
     * @method post
     * @url /v1/api/cart/user
     * @return {} 
     */
    addToCart = async (req,res,next) => {
        console.log(req.body);
        const { productId, shopId, ...rest } = req.body.product;
        const convertedProduct = {
            ...rest,
            productId: convertToObjectID(productId),
            shopId: convertToObjectID(shopId)
        };

    // Update req.body with the converted product object
        req.body.product = convertedProduct;

    // Pass the updated req.body to the service
        new SuccessResponse({
            message: "Successfully created new cart",
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    };

        /**
     * @param {int} userId
     * @param {*} req 
     * @param {*} res 
     * @param {*} next
     * @method patch
     * @url /v1/api/cart/update
     * @return {} 
     */
    updateCart =  async (req,res, next) => {

        new SuccessResponse({
            message : "successfully update cart user",
            metadata : await CartService.addToCartV2(req.body)
        }).send(res);
    };

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @method DELETE
     * @url /v1/api/cart/ 
     */
    deleteCartItem = async(req,res,next) => {
        
        req.body.productId = convertToObjectID(req.body.productId);
        new SuccessResponse({
            message : "Successfully delete Cart User",
            metadata : await CartService.deleteUserCart(req.body)
        }).send(res);
    }

    /**
     * @Describe :: get List
     * @param {*} req 
     * @param {*} res 
     * @method GET
     * @url /v1/api/cart
     */
    listProductCart = async (req,res, next) => {

        new SuccessResponse({
            message : "successfully get all list in cart",
            metadata : await CartService.getListUserCart(req.body)
        }).send(res);
    }

};

 module.exports = new CartController()


 