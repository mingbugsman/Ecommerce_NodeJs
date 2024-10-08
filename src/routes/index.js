'use strict'

const express = require('express');
const { apiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// CHECK APIKEY
router.use(apiKey);



//CHECK PERMISSION CÓ ĐƯỢC TRUY CẬP VÀO HỆ THỐNG BACKEND CỦA TA HAY KHÔNG ???
router.use(checkPermission('0000'))

// SAU KHI CHECK THÌ CHECK CHO NGƯỜI DÙNG
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'))

module.exports = router;