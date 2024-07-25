const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_thumbal: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
  },
  product_type : {
    type : String,
    required : true,
    enum : ['Electronics, Clothing, Furniture']
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
  product_attributes : {
    type : Schema.Types.Mixed,
    required: true
  }
}, {
    timestamps : true,
    collection : COLLECTION_NAME
});

// define the product type = clothing

const clothingSchema = new Schema({
    brand : {type : String, required : true},
    size : { type :String },
    material : { type : String}
}, {
    collection : 'Clothes',
    timestamps : true
});


// define the product type = electronic

const electronicSchema = new Schema({
    manufacturer : { type : String},
    model :{ type : String },
    color : {type : String }
}, {
    collection : "Electronics",
    timestamps : true
})

module.exports = {
    productModel : model(DOCUMENT_NAME,productSchema),
    clothingModel : model("Clothing", clothingSchema),
    electronicModel : model("Electronics", electronicSchema) 
}
