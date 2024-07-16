'use strict'

const keyTokenModel = require("../models/keyToken.model");

// hàm tạo keytoken

class KeyTokenService {
    static createKeyToken = async ({userid,publicKey,privateKey}) => {
        try {
            const keytokens = await keyTokenModel.create({
                user : userid,
                publicKey : publicKey,
                privateKey : privateKey
            });
            return keytokens ? keytokens.publicKey : null;
        } 
        catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService