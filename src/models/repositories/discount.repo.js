const { convertToObjectID } = require("../../utils")
const discountModel = require("../discount.model")


const findDiscount = async ({codeId, shopId}) => {
   console.log("parameters:::",codeId,shopId)
    return await discountModel.findOne({
        discount_code : codeId,
        discount_shopId : convertToObjectID(shopId)
    }).lean();
}

const deleteDiscount = async ({codeId, shopId}) => {
    return await discountModel.findOneAndDelete({
        discount_code : codeId,
        discount_shopId : convertToObjectID(shopId)
    })
}

const createDiscount = async ({
    name, description, type, value, code,
    start_date, end_date, max_using, uses_count,
    user_used, max_uses_per_user, min_order_value, 
    shopId, is_Active, applies_to, product_ids
}) => {
    return await discountModel.create({
        discount_name : name,
        discount_description : description,
        discount_type : type,
        discount_value : value,
        discount_code : code,
        discount_start_date :new Date(start_date),
        discount_end_date : new Date(end_date),
        discount_max_using : max_using,
        discount_uses_count : uses_count,
        discount_min_order_value : min_order_value || 0,
        discount_max_uses_per_user : max_uses_per_user,
        discount_shopId : shopId,
        discount_applies_to : applies_to,
        discount_is_Active : is_Active,
        discount_user_used : user_used,
        discount_product_ids : applies_to === 'all' ? [] : product_ids
    });
}

const findAllDiscountCodeUnselect = async ({limit = 50
    , page = 1, sort = 'ctime', filter ,unSelect, model }) => {
        const skip = (page - 1) * limit;
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        const discounts = await model
          .find(filter)
          .sort(sortBy)
          .skip(skip)
          .limit(limit)
          .select(unSelect)
          .lean();
      return discounts
}

const findAllDiscountCodeselect = async ({limit = 50
    , page = 1, sort = 'ctime', filter ,Select, model }) => {
        const skip = (page - 1) * limit;
        const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
        const discounts = await model
          .find(filter)
          .sort(sortBy)
          .skip(skip)
          .limit(limit)
          .select(Select)
          .lean();
      return discounts
}

const updateDiscount = async({codeId,payload, model, isNew = true}) => {
    return await model.findByIdAndUpdate(convertToObjectID(codeId),payload, {new : isNew});
}

module.exports = {
    findDiscount,
    createDiscount,
    deleteDiscount,
    findAllDiscountCodeUnselect,
    findAllDiscountCodeselect,
    updateDiscount
}