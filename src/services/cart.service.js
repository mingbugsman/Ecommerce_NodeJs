'use strict'

/*
    KEY FEATURES : CART SERVICE

    1. add product to cart ( user )
    2. reduce product quantity ( user )
    3. Increase product quantity ( user )
    4. get list to cart
    5. delete cart ( user )
    6. delete cart item ( user )
*/

const { findUserCart, updateOrcreateCart, updateUserCartQuantity, deleteCart, getAllListProductUserCart } = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");
const {NOTFOUNDERROR} = require('../middleware/core/error.response')


class CartService {

    static async addToCart({userId, product = {}}) {
        // check does cart exist ?
        const userCart = await findUserCart({userId});
        if (!userCart) {
            // if it doesnt, create it
            return await CartService.createUserCart({userId,product});
        }

        if (!userCart.cart_products.length) {
            // exist cart but not product
            userCart.cart_products = [product];
            return await userCart.save();
        }

        // exists with product => update quantity
        return await updateUserCartQuantity({userId, product});

    }
    
    static async createUserCart({userId, product}) {
        const query = {cart_userId : userId, cart_state : 'active'};
        
        const updateOrInsert = {
            $addToSet : {
                cart_products : product
            }
        };
        
        const options = {
            upsert : true, new : true
        };
        return await updateOrcreateCart({query,updateOrInsert, options});
    }

    static async addToCartV2({userId, product= {}}) {
        const { productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0];

        const foundProduct = await getProductById({
            product_id : productId
        })

        if (!foundProduct) throw new NOTFOUNDERROR('not found product --1');

        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId ) 
            throw new NOTFOUNDERROR('product do not belong to the shop');

        if (quantity === 0) {
            // deleted 

        }

        return await CartService.updateUserCartQuantity({
            userId : userId,
            product : {
                productId,
                quantity : quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}) {
        return await deleteCart({userId, productId})
    }

    static async getListUserCart({userId}) {
        return await getAllListProductUserCart({userId})
    }

}

module.exports = CartService;