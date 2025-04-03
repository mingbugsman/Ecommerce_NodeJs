'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const CheckoutController = require('../../controllers/checkout.controller');

const router = express.Router();


router.post('/review', asyncHandler(CheckoutController.checkOutReview));

module.exports = router;