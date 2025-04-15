'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const UploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../config/multer.config');



const router = express.Router();
router.post('/product', asyncHandler(UploadController.uploadFromUrl));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadFileThumb));
router.post('/product/multiples',uploadDisk.array('files',3), asyncHandler(UploadController.uploadMultipleFileImages))

router.post('/product/thumb/s3', uploadMemory.single('file') , asyncHandler(UploadController.uploadFileThumb_S3))

router.use(authentication);


module.exports = router;