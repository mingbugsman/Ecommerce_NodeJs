'use strict'

const AccessService = require("../services/access.service");

const {OK,CREATED, SuccessResponse} = require("../middleware/core/success.response");

class AccessController {
    handlerRefreshToken = async (req,res,next) => {
        new SuccessResponse({
            message : 'Get token success',
            metadata : await AccessService.handlerRefreshToken(req.body)
        }).send(res);
    }
    logout = async (req,res,next) => {
        new SuccessResponse({
            message : "Successfully logout",
            metadata : await AccessService.logout(req.keyStore)
        }).send(res);
    }
    login = async (req,res,next) => {
        new SuccessResponse({
            metadata : await AccessService.login(req.body) 
        }).send(res);
    };
    signUp = async (req,res,next) => {
        console.log(`[p]::signUp:::`,req.body);
        new CREATED({
            message : "Registered OK!",
            metadata :  await AccessService.signUp(req.body),
            options : {
                limit : 10
            }
        }).send(res);
    };
};

module.exports = new AccessController()