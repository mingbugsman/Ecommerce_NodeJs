'use strict'

const { convertToObjectID } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cartId) => {
    return await cartModel.findOne({_id : convertToObjectID(cartId), cart_state : 'active'}).lean();
}

const findUserCart = async ({userId}) => {
    return await cartModel.findOne({cart_userId : userId});
}

const updateOrcreateCart = async ({query, updateOrInsert,options}) => {
    return await cartModel.findOneAndUpdate(query,updateOrInsert, options);
}

const updateUserCartQuantity = async ({userId, product}) => {
    const { productId, quantity} = product;
    const query = {
        cart_userId : userId,
        'cart_products.productId' : productId,
        cart_state : 'active'
    };
    const updateSet = {
        $inc : {
            'cart_products.$.quantity' : quantity
        }
    };
    const options = {
        upsert : true,
        new : true
    };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
}

const deleteCart = async ({userId, productId}) => {
    console.log(productId)
    const query = {
        cart_userId : userId,
        cart_state : 'active'
    },
    updateSet = {
        $pull : {
            cart_products : {
                productId
            }
        }
    }
    return await cartModel.updateOne(query,updateSet);

}

const getAllListProductUserCart = async ({userId}) => {
    return await cartModel.findOne({cart_userId : +userId}).lean();
}

module.exports = {
    findCartById,
    findUserCart,
    getAllListProductUserCart,
    updateOrcreateCart,
    updateUserCartQuantity,
    deleteCart
}