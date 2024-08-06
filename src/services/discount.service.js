"use strict";

const {
  BadRequestError,
  NOTFOUNDERROR,
  ErrorDiscount
} = require("../middleware/core/error.response");

const {
  findDiscount,
  createDiscount,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectID } = require("../utils");

/**
 * 1 - generator discount code [ shop | admin ]
 * 2 - get disount amount [ user ]
 * 3 - get all discount codes [ user | admin ]
 * 4- verify discount code [ user ]
 * 5 - delete discount code [ admin ]
 * 6 - cancel discount
 */

class DiscountService {

  static async createDiscountCode(payload) {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_using,
      uses_count,
      user_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_Active,
      applies_to,
      product_ids,
    } = payload; // 16

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("DISCOUNT CODE HAS EXPRIED");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("start date must be before end_date");
    }

    // create index for discount code
    const foundDiscount = findDiscount({ code, shopId });

    if (foundDiscount && foundDiscount.is_Active) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = createDiscount({
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_using,
      uses_count,
      user_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_Active,
      applies_to,
      product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /*
        get all discount codes available with products
    */

  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = findDiscount({ code, shopId });
    if (!foundDiscount || !foundDiscount.is_Active) {
      throw new NOTFOUNDERROR("discount not exists");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;

    if (discount_applies_to === "all") {
      return await findAllProducts({
        filter: {
          product_shop: convertToObjectID(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific") {
      return await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
  }

  /**
   * get all discount shop
   */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limt,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_Active: true,
      },
      unSelect: {
        __v: 0,
        discount_shopId: 0,
      },
      model: discountModel,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await findDiscount({ codeId, shopId });

    if (!foundDiscount) throw new NOTFOUNDERROR("discount doesnt exist");

    const { discount_is_Active, 
            discount_max_using, 
            discount_min_order_value,
            discount_end_date,
            discount_user_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value} =
      foundDiscount;
    
    if (!discount_is_Active) throw new NOTFOUNDERROR('discount expired'); // expired discount
    if (!discount_max_using) throw new NOTFOUNDERROR('discount are out'); // discount codes has run out

    // check date
    if (new Date() > new Date(discount_end_date)) throw new NOTFOUNDERROR('discount ecode has expired');

    let totalOrder = products.reduce( (acc,product) => {
        return acc + ( product.quantity * price );
    })
    if (discount_min_order_value > 0) {
        if (totalOrder < discount_min_order_value) {
            throw new NOTFOUNDERROR(`discount requires a minium order value of ${discount_min_order_value}`);
        }
    }

    if (discount_max_uses_per_user > 0) {
        const UserDiscount = discount_user_used.find(user => user.userId == userId );
        if (UserDiscount && UserDiscount >= discount_max_uses_per_user) {
            throw new ErrorDiscount('You have reached the maximum usage limit for this discount')
        }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

    return {
        totalOrder, discount : amount, totalPrice : totalOrder - amount
    }

  }
}
