'use strict'



const {SuccessResponse} = require("../middleware/core/success.response");
const DiscountService = require("../services/discount.service");


class DiscountController {
    createDiscount = async (req,res,next) => {
        console.log(req.body);
        new SuccessResponse({
            message : 'Successfully create new discount',
            metadata : await DiscountService.createDiscountCode({
                ...req.body,
                shopId : req.user.userId
            })
        }).send(res);
    } // ok
    
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
                codeId: req.body.codeId,
                shopId: req.user.userId,
                userId: req.body.userId
              })
          }).send(res);
      }

    ////QUERY
    
    getAllDiscountCodes = async (req,res, next) => {
        new SuccessResponse({
            message : 'Successfully get all discount codes',
            metadata : await DiscountService.getAllDiscountCodesByShop({
                ...req.query
            })
        }).send(res);
    } // ok
    
    getAllDiscountCodesWithProducts = async (req,res, next) => {
     // console.log(req.query);
        new SuccessResponse({
            message : 'Successfully get all discount codes',
            metadata : await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res);
    } // ok

    getDiscountAmount = async (req,res, next) => {
       //console.log(req.body);
        new SuccessResponse({
            message : 'product cost after using discount',
            metadata : await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }

    /// END QUERY ///


    /// PUT, PATCH
   updateDiscount = async (req,res,next) => {
        new SuccessResponse({
            message : 'Successfully update discount',
            metadata : await DiscountService.updateDiscountCode(req.body, {
                ...req.body,
                discount_shopId : req.user.userId
            })
        })
   }

    /// END PUT, PATCH
};

 module.exports = new DiscountController()