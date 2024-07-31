const {
  Types: { ObjectId },
} = require("mongoose");
const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../models/product.model");

const { BadRequestError } = require("../middleware/core/error.response");
const {
  findAllDraftsForShop,
  findAllPublishsForShop,
  publishProductByShop,
  UnpublishProductByShop,
  searchProductbyUser,
  findAllProducts,
  findProduct
} = require("../models/repositories/product.repo");
// define factory class to create product

class ProductFactory {
  /**
   * type : 'Clothing'
   * payload : data
   */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError("Invalid Product", type);
    }
  }

  static async updateProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError("Invalid Product", type);
    }
  }
  /////QUERY
  static async searchProducts({ keySearch }) {
    return await searchProductbyUser({ keySearch });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: false };
    return await findAllPublishsForShop({ query, limit, skip });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({limit,sort, page, filter, 
      select : ['product_name', 'product_price', 'product_thumb']
     });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id , unSelect : {'__v' : 0}});
  }
  ////END QUERY

  /// PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async UnpublishProductByShop({ product_shop, product_id }) {
    return await UnpublishProductByShop({ product_shop, product_id });
  }
  /// END PUT
}

// define base Product class

class Product {
  constructor({
    product_name,
    product_description,
    product_price,
    product_shop,
    product_type,
    product_thumbal,
    product_quantity,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_price = product_price),
      (this.product_thumbal = product_thumbal);
    this.product_description = product_description;
    this.product_type = product_type;
    this.product_quantity = product_quantity;
    this.product_shop = new ObjectId(product_shop);
    this.product_attributes = product_attributes;
  }

  // create new product;
  async createProduct(product_id) {
    return await productModel.create({ ...this, _id: product_id });
  }
}

// define sub-class for different product types

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new clothing err");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("create new clothing err");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

module.exports = ProductFactory;
