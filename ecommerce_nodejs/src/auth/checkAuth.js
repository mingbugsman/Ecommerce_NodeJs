'use strict'

const { findById } = require("../services/apiKey.service");

const HEADERS = {
    API_KEY :'x-api-key',
    AUTHORIZATION : 'authorization'
}


const apiKey = async (req,res,next) => {
    try {
        const key = req.headers[HEADERS.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message : 'Forbidden Error'
            });
        }
        // check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message : "Forbidden Error"
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.log(error);
    }
}

const checkPermission = (permission) => {
    return (req,res,next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message : "Permission Denied"
            })        
        }
        console.log(`permissions:::`,req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message : "Permission Denied"
            }) 
        }
        return next();
    };
}


module.exports = {
    apiKey, checkPermission
}