"use strict";

const {Types} = require('mongoose')
const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../product.model");


const findAllDraftsForShop = async ({ query, limit, skip }) => {
    await queryProduct({query,limit, skip})
};

const findAllPublishsForShop = async ({query,limit,skip}) => {
    await queryProduct({query,limit, skip})
}

const publishProductByShop = async ({product_shop,product_id}) => {
    const foundShop = await productModel.findOne({
        product_shop : new Types.ObjectId(product_shop),
        _id : new Types.ObjectId(product_id)
    });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublish = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
}


const queryProduct = async ({ query, limit, skip }) => {
    return await productModel
      .find(query)
      .populate("product_shop", "name email -_id")
      .sort({ updateAt: -1 })
      .skip()
      .limit(limit)
      .lean()
      .exec();
  }; 

module.exports = {
  findAllDraftsForShop, findAllPublishsForShop , publishProductByShop
};
