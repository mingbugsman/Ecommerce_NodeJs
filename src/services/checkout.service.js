'use-strict'

const { BadRequestError } = require("../middleware/core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");

class CheckOutService {
    // login and without login
    /* payload from FE
    {
        cardId,
        userId,
        shop_oder_ids : [
            {
                shopId,
                shop_discount : [],
                item_products : [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shop_discount : [
                    {
                        "shopId",
                        "discountId",
                        codeId
                    }
                ],
                item_products : [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    
    
    }
    
    
    */
    static async CheckoutReview({
        cartId, userId, shop_order_ids
    }) {

        // check cartId is existed ?
        const foundCard = await findCartById(cartId);
        if (!foundCard) throw new BadRequestError("Cart does not exists");

        const checkout_order = {
            totalPrice:0,
            feeShip: 0,
            totalDiscount:0,
            totalCheckout:0 
        }

        const shop_order_ids_new = []
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i];
            // check product available
            console.log("item_products:::", item_products);
            const checkProductServer = await checkProductByServer(item_products);
            console.log(`check Product server:::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!');

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc,product) => {
                return acc + (product.quantity*product.price)
            }, 0);

            // tong tien truoc khi xu ly
            checkout_order.totalPrice+=checkoutPrice;

            const itemCheckout = {
                shopId, 
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscout : checkoutPrice,
                item_products : checkProductServer
            }
            
            // new shop_discount is existed > 0, check it
            if (shop_discounts.length > 0) {
                let totalDiscount = 0;
            
                // Duyệt qua từng mã giảm giá
                for (const discount of shop_discounts) {
                    const { finalPrice = 0, totalDiscount: discountAmount = 0 } = 
                        await DiscountService.getDiscountAmount({
                            discountCodes: [discount.codeId], // Duyệt từng mã
                            userId,
                            shopId,
                            products: checkProductServer
                        });
                    totalDiscount += discountAmount;
                }
                checkout_order.totalDiscount += totalDiscount; 
                if (totalDiscount > 0) {
                    itemCheckout.priceApplyDiscout = checkoutPrice - totalDiscount;
                }
            }
            
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscout;
            shop_order_ids_new.push(itemCheckout);
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckOutService