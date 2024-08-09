'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();


router.post('', asyncHandler(cartController.addToCart));
router.patch('/update', asyncHandler(cartController.updateCart));
router.delete('/', asyncHandler(cartController.deleteCartItem));
router.get('', asyncHandler(cartController.listProductCart));


module.exports = router;