'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct)); 
router.get('',asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));


// authentication
router.use(authentication);
/////
router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', productController.publishProductByShop);
router.post('/Unpublish/:id', asyncHandler(productController.UnpublishProductByShop));

///patch, put
router.patch('/:productId', asyncHandler(productController.updateProduct));

router.get('/drafts', asyncHandler(productController.getAllDraftsForShop));
router.get('/Publish', asyncHandler(productController.getAllPublishForShop));

module.exports = router;