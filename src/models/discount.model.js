'use strict'

const {model, Schema} = require('mongoose');


const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';


const discountModel = new Schema({
    discount_name : {type : String, required : true},
    discount_description : { type : String, required : true },
    discount_type : {type : String, default : 'fixed_amount'},
    discount_value : {type : Number, required : true}, // 10.000, 10
    discount_code : {type : String, required : true},
    discount_start_date : {type : Date, required : true}, // ngay bat dau ma giam gia
    discount_end_date : {type : Date, required : true}, // ngay ket thuc ma giam gia
    discount_max_using : {type : Number, required: true}, // so luong discount duoc ap dung
    discount_uses_count : {type : Number, required : true}, // Discount quantity used
    discount_user_used : {type :Array, default : [1,2,3]}, // Store users who have used the discount
    discount_max_uses_per_user : { type : Number, required : true }, // Maximum discount allowed for users to use
    discount_min_order_value : {type : Number, required : true}, 
    discount_shopId : {type : Schema.Types.ObjectId, ref : 'Shop'},
    discount_is_Active : { type : Boolean, default : true },
    discount_applies_to : {type : String, required : true, enum : ['all', 'specific']},
    discount_product_ids : {type : Array , default : []} //  The product has a discount code applied  
    //16
}, {
    timestamps : true,
    collection : COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME,discountModel);