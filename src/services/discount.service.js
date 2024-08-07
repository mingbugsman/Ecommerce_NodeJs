"use strict";

const {
  BadRequestError,
  NOTFOUNDERROR,
  ErrorDiscount,
} = require("../middleware/core/error.response");
const discountModel = require("../models/discount.model");

const {
  findDiscount,
  createDiscount,
  deleteDiscount,
  findAllDiscountCodeUnselect,
  findAllDiscountCodeselect,
  updateDiscount,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectID, removeUndefinedObject } = require("../utils");

/**
 * 1 - generator discount code [ shop | admin ]
 * 2 - get disount amount [ user ]
 * 3 - get all discount codes [ user | admin ]
 * 4- verify discount code [ user ]
 * 5 - delete discount code [ admin ]
 * 6 - cancel discount
 */

class DiscountService {
  // discount business

  static async createDiscountCode(payload) {
    // CREATE DISCOUNT CODE
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

  static async updateDiscountCode(data) {
    // update discount
    const { discount_code, discount_shopId } = data;
    const foundDiscount = await findDiscount({
      discount_code,
      discount_shopId,
    });

    if (!foundDiscount || !foundDiscount.discount_is_Active) {
      throw new NOTFOUNDERROR("discount not exists");
    }
    // update discount
    const dataWithoutUndefined = removeUndefinedObject(data);
    const newUpdateDiscount = updateDiscount({
      codeId: discount_code,
      payload: dataWithoutUndefined,
      model: discountModel,
    });
    return newUpdateDiscount;
  }

  static async getAllDiscountCodeWithProduct({
    //get all discount codes available with products
    codeId,
    shopId,
    limit,
    page,
  }) {
    console.log(codeId, shopId);
    const foundDiscount = await findDiscount({ codeId, shopId });

    if (!foundDiscount || !foundDiscount.discount_is_Active) {
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

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    // get all discount shop
    const discounts = await findAllDiscountCodeselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_Active: true,
      },
      Select: {
        _id: 1,
        discount_name: 1,
        discount_code: 1,
      },
      model: discountModel,
    });
    return discounts;
  }

  // GET DISCOUNT AMOUNT
  static async getDiscountAmount({ discountCodes, userId, shopId, products }) {

    //get total original discount amount 
    let totalOrder = products.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );

    console.log(totalOrder);

    // caculate total discount value for every discount in req.body.discountCode (array discount)
    let totalDiscount = 0;

    for (const codeId of discountCodes) {
      const foundDiscount = await findDiscount({ codeId, shopId });

      if (!foundDiscount)
        throw new NOTFOUNDERROR(`Discount code ${codeId} doesn't exist`);

      const {
        discount_is_Active,
        discount_max_using,
        discount_min_order_value,
        discount_end_date,
        discount_user_used,
        discount_max_uses_per_user,
        discount_type,
        discount_value,
      } = foundDiscount;

      if (!discount_is_Active)
        throw new NOTFOUNDERROR(`Discount code ${codeId} has expired`);
      if (!discount_max_using)
        throw new NOTFOUNDERROR(`Discount code ${codeId} is out of uses`);

      if (new Date() > new Date(discount_end_date))
        throw new NOTFOUNDERROR(`Discount code ${codeId} has expired`);

      if ( discount_min_order_value > 0 && totalOrder < discount_min_order_value ) {
        throw new NOTFOUNDERROR(
          `Discount code ${codeId} requires a minimum order value of ${discount_min_order_value}`
        );
      }

      if (discount_max_uses_per_user > 0) {
          const userDiscountUsage = discount_user_used.find(
            (user) => user.userId === userId
          );
          if ( userDiscountUsage && userDiscountUsage >= discount_max_uses_per_user ) {
            throw new ErrorDiscount( `You have reached the maximum usage limit for discount code ${codeId}` );
          }
      }

      const discountAmount =
      discount_type === "fixed_amount" ? discount_value  : totalOrder * (discount_value / 100);
      totalDiscount += discountAmount;

      // Reduce total order value by discount amount for the next discount calculation
    }

    return {
      totalOrder,
      totalDiscount,
      finalPrice: totalOrder - totalDiscount,
    };
  }

  static async deleteDiscount({ codeId, shopId }) {
    //DELETE DISCOUNT
    const deleted = deleteDiscount({ codeId, shopId });
    return deleted;
  }

  static async cancelDiscount({ codeId, shopId, userId }) {
    //CANCEL DISCOUNT
    const foundDiscount = findDiscount({ codeId, shopId });

    if (!foundDiscount) throw new NOTFOUNDERROR("Not found discount");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_user_used: userId,
      },
      $inc: {
        discount_max_using: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
