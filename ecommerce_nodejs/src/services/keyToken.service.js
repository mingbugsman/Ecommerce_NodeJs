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
    static findbyId = async (userId) => {
        return await keyTokenModel.findOne({user : new ObjectId(userId)}).lean();
    }
    static removeKeybyId = async (keyId) => {
        return await keyTokenModel.deleteOne({_id : new ObjectId(keyId)} );
    }

    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne( {refreshTokenUsed : refreshToken}).lean();
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne( { refreshToken});
    }
    static deleteKeyById = async (userId) => {
        const objectId = new ObjectId(userId)
        console.log(objectId);
        return await keyTokenModel.deleteOne({ user: objectId });
    }
}

module.exports = KeyTokenService    