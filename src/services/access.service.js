'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const ROLE_SHOP = {
    SHOP : 'SHOP',
    WRITER : 'WRITER',
    EDITOR : 'EDITOR',
    ADMIN : 'ADMIN' 
}

class AccessService {

    static signUp = async ({nameshop, email, password}) => {
        try {

            // buoc 1 : check email exists ???
            const holderShop = await shopModel.findOne({email}).lean(); // sped up query cuz it returns original obj js
            if (holderShop) {
                return {
                    code : 'xxxx',
                    message : 'Shop already registered'
                }
            }
            const _HASHpassWORD = await bcrypt.hash(password,10);
            const newShop = await shopModel.create({
                nameshop,email,password : _HASHpassWORD,roles : [ROLE_SHOP.SHOP]
            })
            if (newShop) { // create token

                // created private key :: cho refresh token, public key ::: cho access token
                const privateKey= crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                console.log(privateKey,publicKey);
             // save it in collection key store
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userid : newShop._id,
                    publicKey,
                    privateKey
                });
                if (!publicKeyString) {
                    return {
                        code : 'xxxx',
                        message : 'publicKeyString error'
                    };
                }
                
                // có public key string tức là đã tạo hoàn tất thì tạo key token
                const tokens =  await createTokenPair({userId : newShop._id, email}, 
                                                       publicKey,
                                                       privateKey);
                console.log(`created token success`, tokens);
                return {
                    code : 201,
                    metadata : {
                        shop : getInfoData({fields : ['id','nameshop', 'email'] , object : newShop}),
                        tokens
                    }
                }
            }

            else return {
                code : 200,
                metadata : null
            }

        } catch (error) {
            return {
                code : 'xxx',
                message : error.message,
                status : 'error'
            }
        }
    }
}

module.exports = AccessService