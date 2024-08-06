'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const DiscountService = require("../services/discount.service");


class DiscountController {
    createDiscount = async (req,res,next) => {
        console.log(req.body);
        new SuccessResponse({
            message : 'Successfully create new discount',
            metadata : await DiscountService.createDiscountCode({
                ...req.query,
                shopId : req.user.userId
            })
        }).send(res);
    }
    
    deleteDiscount = async (req,res, next) => {
        new SuccessResponse({
            message : 'Successfully delete discount',
            metadata : await DiscountService.deleteDiscount({
                codeId : req.params.codeId,
                shopId : req.user.userId
            })
        }).send(res);
    }

    cancelDiscount = async (req, res, next) => {
          new SuccessResponse({
            message: 'Successfully canceled discount code',
            metadata: await DiscountService.cancelDiscount({
                codeId: req.params.codeId,
                shopId: req.user.userId,
                userId: req.user.userId
              })
          }).send(res);
      }

    ////QUERY
    getAllDiscountCodes = async (req,res, next) => {
        new SuccessResponse({
            message : 'Successfully get all discount codes',
            metadata : await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId : req.user.userId
            })
        }).send(res);
    }
    
    getAllDiscountCodesWithProducts = async (req,res, next) => {
        new SuccessResponse({
            message : 'Successfully get all discount codes',
            metadata : await DiscountService.getAllDiscountCodeWithProduct({
                ...req.body,
                shopId : req.user.userId
            })
        }).send(res);
    }

    getDiscountAmount = async (req,res, next) => {
        new SuccessResponse({
            message : 'Successfully get all discount codes',
            metadata : await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId : req.user.userId
            })
        }).send(res);
    }

    /// END QUERY ///


    /// PUT, PATCH
   

    /// END PUT, PATCH
};

 module.exports = new DiscountController()