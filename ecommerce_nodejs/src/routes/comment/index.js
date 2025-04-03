'use strict'

const express = require('express');
const  asyncHandler  = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const commentController = require('../../controllers/comment.controller');


const router = express.Router();

router.get('',asyncHandler(commentController.getCommentsByParentId))

router.use(authentication);

router.post('', asyncHandler(commentController.createNewComment));
router.delete('', asyncHandler(commentController.deleteComment));

module.exports = router;