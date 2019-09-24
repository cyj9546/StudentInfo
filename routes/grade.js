var express = require('express');
const db=require('../db/connect')
var router = express.Router();
var {formatData}= require('./../util/result')
const passport = require('passport')
/* GET home page. */
router.get('/',(req,res)=>{
    res.send(formatData({}))
})


/**
 * @api {post} api/grade/info
 * @apiName 获取学生成绩
 * @apiGroup Grade
 * @apiHeader {String} Authorization 用户授权token
 * @apiSuccess {String} msg  数据
 * @apiSuccess {Number} status 状态
 */
router.get('/info', async(req,res)=>{
    let sql = `select subject,score,user.number,user.username,term,course_type,course_nature,school_year from grade,user where grade.uid = ${req.user.id} and grade.uid = user.id`
    try {
        let data = await db.query(sql)
        if (data.length>0) {
            console.log(data);
            res.send({status:200,data:data})
        }
        else{
            res.send({status:200,msg:'暂无该学生成绩'})
        }
    } catch (error) {
        res.send(formatData({
            msg:error,
            status:400
          }))
    }
})

//退出 删除在线表token
router.post('/logOut',async(req,res)=>{
  let delete_token_sql = `DELETE FROM online WHERE uid = ${req.user.id}`
  await db.query(delete_token_sql)
  res.send({status:200,msg:'succeed'})
})
module.exports = router;
