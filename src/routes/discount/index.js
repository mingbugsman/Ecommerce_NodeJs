'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');

const router = express.Router();


//get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts));
router.get('/list_discount_shop', asyncHandler(discountController.getAllDiscountCodes))

// authentication
router.use(authentication);
/////
router.post('', asyncHandler(discountController.createDiscount));
router.patch('/updateDiscount', asyncHandler(discountController.updateDiscount));


///patch, put

module.exports = router;