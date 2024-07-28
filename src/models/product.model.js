const { type } = require("express/lib/response");
const { model, Schema } = require("mongoose");
const slugify = require('slugify');

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_slug : String,
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
  product_type: {
    type: String,
    required: true,
    enum: ['Electronic', 'Clothing', 'Furniture']  // Corrected enum definition
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
  },
  product_ratingAverage : {
    type : Number,
    default : 4.5,
    min : [1,"rating must be above 1"],
    max : [5, "rating must be under 5.0"],
    set : (val) => Math.round(val*10)/10
  },
  product_variations : {
    type : Array,
    default : []
  },
  isDraft : {
    type : Boolean, default : true, index : true, select:false
  },
  isPublish : {
    type : Boolean, default : false, index : true, select : false
  }
}

, {
    timestamps : true,
    collection : COLLECTION_NAME
});
/*---before save --*/
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, {lower : true});
  next();
})


// define the product type = clothing

const clothingSchema = new Schema({
    brand : {type : String, required : true},
    size : { type :String },
    material : { type : String},
    product_shop : {type : Schema.Types.ObjectId, ref : "Shop"},
}, {
    collection : 'Clothes',
    timestamps : true
});


// define the product type = electronic

const electronicSchema = new Schema({
    manufacturer : { type : String},
    model :{ type : String },
    color : {type : String },
    product_shop : {type : Schema.Types.ObjectId, ref : "Shop"}
}, {
    collection : "Electronics",
    timestamps : true
})

module.exports = {
    productModel : model(DOCUMENT_NAME,productSchema),
    clothingModel : model("Clothing", clothingSchema),
    electronicModel : model("Electronics", electronicSchema) 
}
