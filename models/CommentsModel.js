/*
能操作products集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const commentsSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 评论人
  content: {type: String, required: true}, // 所属分类的父分类id
  time:{type: String},
})


// 3. 定义Model(与集合对应, 可以操作集合)
const CommentsModel = mongoose.model('comments', commentsSchema)

// 4. 向外暴露Model
module.exports = CommentsModel;