'use strict'

const express = require('express');
const router = express.Router();

// CHECK API



//CHECK PERMISSION CÓ ĐƯỢC TRUY CẬP VÀO HỆ THỐNG BACKEND CỦA TA HAY KHÔNG ???


// SAU KHI CHECK THÌ CHECK CHO NGƯỜI DÙNG
router.use('/v1/api', require('./access'))




module.exports = router;