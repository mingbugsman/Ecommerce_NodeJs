"use strict";

const { Types } = require("mongoose");
const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishsForShop = async ({ query, limit, skip }) => {
  console.log("before send all parameters into function query product",query,limit,skip);
  return await queryProduct({ query, limit, skip });
};

const searchProductbyUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await productModel
    .find(
      { isDraft: true, $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  console.log(result);
  return result;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const UnpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublish = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  console.log("all query is :::",query,limit,skip);
  return await productModel.find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return products;
};

const findProduct = async ({product_id, unSelect }) => {
  console.log(product_id,unSelect)
  return await productModel.findById(product_id).select(unSelect);
}

const updateProductbyId = async ({
  product_id, payload, model, isNew = true
}) => {
  console.log("parameters:::",product_id, payload, model);
  await model.findByIdAndUpdate(product_id,payload, {new : isNew});
}

module.exports = {
  findAllDraftsForShop,
  findAllPublishsForShop,
  publishProductByShop,
  UnpublishProductByShop,
  searchProductbyUser,
  findAllProducts,
  findProduct,
  updateProductbyId
};
