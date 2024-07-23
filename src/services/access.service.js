"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
} = require("../middleware/core/error.response");
const { findByEmail } = require("./shop.service");

const ROLE_SHOP = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static logout = async (KeyStore) => {
    const isDeleted = await KeyTokenService.removeKeybyId(KeyStore._id);
    console.log(isDeleted);
    return isDeleted; 
  }

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("shop not registered");

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
        refreshToken : tokens.refreshToken,
        privateKey,
        publicKey,
        userid : foundShop._id
    })
    return {
        shop: getInfoData({fields: ["id", "nameshop", "email"], object: foundShop}),
        tokens,
      }
    };

  static signUp = async ({ nameshop, email, password }) => {
    // buoc 1 : check email exists ???
    const holderShop = await shopModel.findOne({ email }).lean(); // sped up query cuz it returns original obj js
    if (holderShop) {
      throw new BadRequestError("Shop already exists");
    }
    const _HASHpassWORD = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      nameshop,
      email,
      password: _HASHpassWORD,
      roles: [ROLE_SHOP.SHOP],
    });
    if (newShop) {
      // create token

      // created private key :: cho refresh token, public key ::: cho access token
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log(privateKey, publicKey);
      // save it in collection key store
      const KeyStore = await KeyTokenService.createKeyToken({
        userid: newShop._id,
        publicKey,
        privateKey,
      });
      if (!KeyStore) {
        throw new BadRequestError("KeyStore Error");
      }

      // có public key string tức là đã tạo hoàn tất thì tạo key token
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`created token success`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["id", "nameshop", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    } else
      return {
        code: 200,
        metadata: null,
      };
  };
}

module.exports = AccessService;
