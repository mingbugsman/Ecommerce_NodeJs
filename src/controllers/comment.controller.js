"use strict";

const { SuccessResponse } = require("../middleware/core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  /**
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @method post
   * @url /v1/api/comment
   * @return {}
   */
  createNewComment = async (req, res, next) => {
    // Pass the updated req.body to the service
    console.log(req.body);
    new SuccessResponse({
      message: "Successfully add comment",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  /**
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @method post
   * @url /v1/api/
   * @return {list comments}
   */
  getCommentsByParentId = async (req, res, next) => {
    // Pass the updated req.body to the service
    console.log(req.body);
    new SuccessResponse({
      message: "Successfully get comments",
      metadata: await CommentService.getCommentsByParentId(req.body),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
        message: 'deleted comment',
        metadata: await CommentService.deleteComments(req.body)
    }).send(res)
  }
}

module.exports = new CommentController();
