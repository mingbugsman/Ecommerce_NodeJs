'use strict'
const JWT = require("jsonwebtoken")

 

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

module.exports = {
    createTokenPair
}