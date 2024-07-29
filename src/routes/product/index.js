'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// authentication
router.use(authentication);
/////
router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', productController.publishProductByShop);

router.get('/drafts', asyncHandler(productController.getAllDraftsForShop));
router.get('/Pulish', asyncHandler(productController.getAllPulishForShop));

module.exports = router;