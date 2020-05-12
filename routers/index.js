/*
用来定义路由的路由器模块
 */
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CommentsModel=require('../models/CommentsModel')


// 得到路由器对象
const router = express.Router()
// console.log('router', router)

// 指定需要过滤的属性
const filter = {password: 0, __v: 0}


// 登陆
router.post('/login', (req, res) => {
  const {username, password} = req.body
  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // 登陆成功
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        res.send({status: 0 , data: user});

      } else {// 登陆失败
        res.send({status: 1, msg: '用户名或密码不正确!'})
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({status: 1, msg: '登陆异常, 请重新尝试'})
    })
})

// 添加用户
router.post('/manage/user/add', (req, res) => {
  // 读取请求参数数据
  const {username, password} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  UserModel.findOne({username})
    .then(user => {
      // 如果user有值(已存在)
      if (user) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此用户已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return UserModel.create({...req.body, password: md5(password || 'atguigu')})
      }
    })
    .then(user => {
      // 返回包含user的json数据
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({status: 1, msg: '添加用户异常, 请重新尝试'})
    })
})


// 删除用户
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

//获取评论列表
router.get('/comments/list',(req, res) =>{
  CommentsModel.find({  })
  .then( comments =>{
    res.send({ status: 0, data: { comments } })
  } )
  .catch(()=>{
    console.error('获取评论列表异常', error)
      res.send({status: 1, msg: '获取评论列表异常, 请重新尝试'})
  })
})
//获得自己的列表
router.post('/comments/list',(req, res) =>{
  const { username } =req.body;
  CommentsModel.find({ username:username})
  .then( comments =>{
    res.send({ status: 0, data: { comments } })
  } )
  .catch(()=>{
    console.error('获取评论列表异常', error)
      res.send({status: 1, msg: '获取评论列表异常, 请重新尝试'})
  })
})

//添加评论
router.post('/comments/add',(req, res) =>{
  const { username , content ,time} = req.body;
  CommentsModel.create({username:username  ,content:content, time: time})
  .then(rComment=>{
    res.send({status: 0 , data : rComment})
  })
  .catch(error=>{
    console.error('添加评论异常', error)
    res.send({status: 1, msg: '添加评论异常'})
  })
});

//删除评论
router.post( '/comments/delete', (req,res)=>{
  const {time} = req.body;
  CommentsModel.deleteOne({time:time})
  .then(doc=>{
    res.send({status:0})
  }).catch(err=>{res.send({status:1})})
})

module.exports = router