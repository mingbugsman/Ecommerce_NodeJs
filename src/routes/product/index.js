'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct)); 

// authentication
router.use(authentication);
/////
router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', productController.publishProductByShop);
router.post('/Unpublish/:id', asyncHandler(productController.UnpublishProductByShop));


router.get('/drafts', asyncHandler(productController.getAllDraftsForShop));
router.get('/Publish', asyncHandler(productController.getAllPublishForShop));

module.exports = router;