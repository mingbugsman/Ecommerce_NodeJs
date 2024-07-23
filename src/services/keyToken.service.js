'use strict'

const { Types : {ObjectId} } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

// hàm tạo keytoken

class KeyTokenService {
    static createKeyToken = async ({userid,publicKey,privateKey, refreshToken}) => {
        try {
            const filter = {user: userid};
            const update = { publicKey, privateKey, refreshTokenUsed : [], refreshToken };
            const options = {upsert : true, new : true};

            const tokens = await keyTokenModel.findOneAndUpdate(filter,update,options);

            return tokens ? tokens.publicKey : null;
        } 
        catch (error) {
            return error;
        }
    }
    static removeKeybyId = async (id) => {
        console.log(id);
        return await keyTokenModel.deleteOne({_id : new ObjectId(id)} );
    }
}

module.exports = KeyTokenService