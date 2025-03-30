'use strict'

const Comment = require('../models/comment.model');
const { convertToObjectID } = require('../utils');
const { NOTFOUNDERROR } = require('../middleware/core/error.response');

/*
    Comment service:
    + add comment [user, shop]
    + get a list comments [user, shop]
    + delete comment
*/

class CommentService {
    static async createComment({ productId, userId, content, parentCommentId= null}) {
        // Tạo mới đối tượng comment
        console.log(parentCommentId)
        const comment = new Comment({
            comment_productId: productId,
            commnet_userId: userId, // Lưu ý: nếu đây là lỗi chính tả, hãy sửa lại thành comment_userId
            comment_content: content,
            comment_parentId: parentCommentId
        });

        let rightValue;
        if (parentCommentId) {
            // Nếu là bình luận trả lời, tìm bình luận cha
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) throw new NOTFOUNDERROR('parent comment not found');

            // Lấy giá trị comment_right của bình luận cha
            rightValue = parentComment.comment_right;

            // Cập nhật tất cả các comment trong cùng sản phẩm có comment_right >= rightValue, tăng thêm 2
            await Comment.updateMany({
                comment_productId: convertToObjectID(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            });

            // Cập nhật tất cả các comment có comment_left > rightValue, tăng thêm 2
            await Comment.updateMany({
                comment_productId: convertToObjectID(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            });
        } else {
            // Nếu là bình luận gốc (top-level comment)
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectID(productId)
            }, 'comment_right', { sort: { comment_right: -1 } });

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
  static async getComments({ productId }) {
   
    const comments = await Comment.find({
      comment_productId: convertToObjectID(productId)
    }).sort({ comment_left: 1 });

    const commentObjects = comments.map((doc) => doc.toObject());


    const buildTree = (nodes) => {
      let tree = [];
      let stack = [];
      for (const node of nodes) {
        node.children = [];
       
        while (stack.length > 0 && node.comment_right > stack[stack.length - 1].comment_right) {
          stack.pop();
        }

       
        if (stack.length === 0) {
          tree.push(node);
        } else {
  
          stack[stack.length - 1].children.push(node);
        }
        stack.push(node);
      }
      return tree;
    };

    const commentTree = buildTree(commentObjects);
    return commentTree;
  }
}

module.exports = CommentService;
