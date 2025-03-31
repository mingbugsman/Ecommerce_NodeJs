"use strict";

const Comment = require("../models/comment.model");
const { convertToObjectID } = require("../utils");
const { NOTFOUNDERROR } = require("../middleware/core/error.response");
const { getProductById } = require("../models/repositories/product.repo");

/*
    Comment service:
    + add comment [user, shop]
    + get a list comments [user, shop]
    + delete comment
*/

class CommentService {

  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    // Tạo mới đối tượng comment
    console.log(parentCommentId);
    const comment = new Comment({
      comment_productId: productId,
      commnet_userId: userId, // Lưu ý: nếu đây là lỗi chính tả, hãy sửa lại thành comment_userId
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // Nếu là bình luận trả lời, tìm bình luận cha
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NOTFOUNDERROR("parent comment not found");

      // Lấy giá trị comment_right của bình luận cha
      rightValue = parentComment.comment_right;

      // Cập nhật tất cả các comment trong cùng sản phẩm có comment_right >= rightValue, tăng thêm 2
      await Comment.updateMany(
        {
          comment_productId: convertToObjectID(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      // Cập nhật tất cả các comment có comment_left > rightValue, tăng thêm 2
      await Comment.updateMany(
        {
          comment_productId: convertToObjectID(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      // Nếu là bình luận gốc (top-level comment)
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectID(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // Gán chỉ số left/right cho comment mới
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }
  /**
   * Get list comment
   * @param {String} productId - ID product
   * @returns {Array} comment tree sorted
   */
  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip = zero
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NOTFOUNDERROR("Not found comment for product");
      const comments = await Comment.find({
        comment_productId: convertToObjectID(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });
      return comments;
    }
  }

  // delete comments
  static async deleteComments({commentId, productId}) {
    // check the product exists in the database
    const foundProduct = await getProductById({
      product_id: productId
    });
    if (!foundProduct) throw new NOTFOUNDERROR("product not found")
    
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) throw new NOTFOUNDERROR("comment not found")

    const leftValue = foundComment.comment_left;
    const rightValue = foundComment.comment_right;

    const width = rightValue - leftValue + 1;
    // delete all sub comment id
    await Comment.deleteMany({
      comment_productId: convertToObjectID(productId),
      comment_left : {$gte: leftValue, $lte: rightValue}
    })
    
    // 4. update value rest of left and right
    await Comment.updateMany({
      comment_productId: convertToObjectID(productId),
      comment_right : {$gt: rightValue}
    }, {
      $inc : {comment_right: -width}
    })

    await Comment.updateMany({
      comment_productId: convertToObjectID(productId),
      comment_left : {$gt: rightValue}
    }, {
      $inc : {comment_left: -width}
    })
    return true;
  }
}

module.exports = CommentService;
