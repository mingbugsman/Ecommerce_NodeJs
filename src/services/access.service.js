'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt');
const crypto = require('crypto');


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
                    modulusLength : 4096
                });
                console.log({privateKey,publicKey});
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