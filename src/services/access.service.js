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

                // created private key :: dua cho nguoi dung de sign, public key ::: verify nguoi dung
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength : 4096,
                    publicKeyEncoding : {
                        type : 'pkcs1', //public key cryptoGraphy standards
                        format :'pem'
                    },
                    privateKeyEncoding : {
                        type : 'pkcs1',
                        format : 'pem'
                    }
                });

             // save it in collection key store
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userid : newShop._id,
                    publicKey
                });
                if (!publicKeyString) {
                    return {
                        code : 'xxxx',
                        message : 'publicKeyString error'
                    };
                }
                
                const publicKeyObject = crypto.createPublicKey(publicKeyString);
                console.log(publicKeyObject);
                // có public key string thì tạo key token
                const tokens =  await createTokenPair({userId : newShop._id, email}, 
                                                       publicKeyObject,
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