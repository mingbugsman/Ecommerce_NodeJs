'use strict'

const keyTokenModel = require("../models/keyToken.model");

// hàm tạo token

class KeyTokenService {
    static createKeyToken = async ({userid,publicKey}) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await keyTokenModel.create({
                user : userid,
                publicKey : publicKeyString
            });
            return tokens ? publicKeyString : null;
        } 
        catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService