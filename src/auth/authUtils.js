'use strict'
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NOTFOUNDERROR } = require("../middleware/core/error.response");
const keyTokenModel = require("../models/keyToken.model");
const mongoose = require("mongoose");

const HEADERS = {
    API_KEY :'x-api-key',
    CLIENT_ID : 'x-client-id',
    AUTHORIZATION : 'authorization'
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // create access token and refresh token
        const accessToken = await JWT.sign(payload, publicKey , {
            expiresIn : '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey , {
            expiresIn : '7 days'
        });
        
        // verify access token and refresh token
        JWT.verify(accessToken,publicKey, (err, decoded) => {
            if (err) {
                console.log(`error verify:::`,err);
            }
            else {
                console.log(`decoded verify`,decoded);
            }
        })
        return {accessToken, refreshToken};
    } catch (error) {
        return error;
    }
}

const authentication = asyncHandler(async (req,res,next) => {
    /*
    1- check userid missing
    2- get access token
    3- verify token
    4- check user in dbs
    5- check keystore with this user id
    6- if ok return next
    */

   //1
   const iduser = req.headers[HEADERS.CLIENT_ID];
   if (!iduser) throw new AuthFailureError("Invalid request");
   //2
   const objectIDString = new mongoose.Types.ObjectId(iduser);
   const keyStore = await keyTokenModel.findOne({user : objectIDString }).lean();
   if (!keyStore) {
    throw new NOTFOUNDERROR("Invalid request");
   }

   //3 
   const accessToken = req.headers[HEADERS.AUTHORIZATION];
   if (!accessToken) throw new AuthFailureError("Invalid Request");



   try {

        const {userId} = JWT.verify(accessToken, keyStore.publicKey);
        
        if (iduser !== userId) throw new AuthFailureError("Invalid UserId");

        req.keyStore = keyStore;

        return next();

   } catch (error) {
        throw error
   }

})

module.exports = {
    createTokenPair, authentication
}