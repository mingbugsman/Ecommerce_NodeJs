'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');

const router = express.Router();

// 4/7

//get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount)); // ok
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts)); // ok
router.get('/list_discount_shop', asyncHandler(discountController.getAllDiscountCodes)) // ok

// authentication
router.use(authentication);
/////
router.post('', asyncHandler(discountController.createDiscount)); // ok 
router.post('/cancel_discount', asyncHandler(discountController.cancelDiscount)); // ok
router.delete('/:codeId', asyncHandler(discountController.deleteDiscount)); // ok
///patch, put
router.patch('/:id_discount', asyncHandler(discountController.updateDiscount));


module.exports = router;