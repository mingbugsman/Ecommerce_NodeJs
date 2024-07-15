'use strict'

const keyTokenModel = require("../models/keyToken.model");

// hàm tạo keytoken

class KeyTokenService {
    static createKeyToken = async ({userid,publicKey}) => {
        try {
            const publicKeyString = publicKey.toString();
            const keytokens = await keyTokenModel.create({
                user : userid,
                publicKey : publicKeyString
            });
            return keytokens ? keytokens.publicKey : null;
        } 
        catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService