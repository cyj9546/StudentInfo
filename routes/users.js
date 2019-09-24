var express = require('express');
const db=require('../db/connect')
var router = express.Router();
var {formatData}= require('./../util/result')
var jwt = require('jsonwebtoken')
const keys = require('./../config/key')
var bcrypt = require('bcrypt')
const passport = require('passport')



var sd = require('silly-datetime');








/**
 * @api {post} api/user/register/:username/:password
 * @apiName 注册 
 * @apiGroup User
 * @apiParam {String} username 用户名.
 * @apiParam {String} password 密码.
 * @apiSuccess {String} msg  数据
 * @apiSuccess {Number} status 状态
 */



router.post('/register', async(req, res, next)=> {
  let {username,password} = req.body
  let sql=`select username from user where username='${username}'`
  try{
    console.log(sql)
    /* 查询用户 */
    let data=await db.query(sql);
    console.log(data[0])
    /* 用户存在*/
    if (data.length>0) {
      res.send({status:400,msg:'用户已注册'})   
    }
    /* 用户不存在 */
    else{
      /* password不为undefined */
      if (password) {
        bcrypt.genSalt(10, function (err, salt) {
           /* 密码加密*/
          bcrypt.hash(password, salt, async(err, hash) => {
            if (err) throw err;
            password = hash;
            sql = `insert into user (username,password) values ('${username}','${password}')`
           await db.query(sql)
           res.send(formatData({}))
          });
        });


        
      }
      else{
        res.send(formatData({
          status:400
        }))
      }
    }
  }catch(err){
    console.log(err)
      res.send(formatData({
        msg:err,
        status:400
      }))
  }
});


/**
 * @api {post} api/user/login/:username/:password
 * @apiName 登录
 * @apiGroup User
 * @apiParam {String} username 用户名.
 * @apiParam {String} password 密码.
 * @apiSuccess {String} msg  数据
 * @apiSuccess {Number} status 状态
 * @apiSuccess {String} token 令牌
 */

router.post('/login',async(req,res)=>{
  let {username,password} = req.body
  let sql_user = `select id,username,password from user where username='${username}'`
  let data_user = await db.query(sql_user)
  if (data_user.length == 0) {
    res.send({status:400,msg:'该用户不存在'})
  }
  else{
     /* bcrypt密码匹配 */
     bcrypt.compare(password, data_user[0].password)
     .then(async(result)=>{
       /* 匹配成功 */
       if (result) {
         /* 加密规则 */
         const rule = {
           id: data_user[0].id,
           name: data_user[0].username
         };
         /* jwt生产token 规则 名字 过期时间 */
         jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, async(err, token) => {
           if (err){throw err} 
           else{
            let check_online =`select uid from online,user where user.id =${data_user[0].id} and user.id = online.uid `
            let check_data = await db.query(check_online)
            if (check_data.length>0) {
             
              
              let uodate_user =`update online set token = '${'Bearer ' + token}',login_time ='${Date.now()}'  where uid = '${check_data[0].uid}'`
              await db.query(uodate_user)
              res.json({
                status:200,
                success: true,
                token: 'Bearer ' + token
              });
            }else{
              let sql_online = `insert into online  (uid,token,login_time) values ('${data_user[0].id}','${'Bearer ' + token}','${Date.now()}')`
              await db.query(sql_online)
              res.json({
                status:200,
                success: true,
                token: 'Bearer ' + token
              });
            }
           
           }
          
         });

        
       }
       else{
         res.send({status:400,msg:'密码错误'})
       }
     })
    
  }
})

/**
 * @api {post} api/user/forget/:username/:password
 * @apiName 忘记密码
 * @apiGroup User
 * @apiParam {String} username 用户名.
 * @apiParam {String} password 密码.
 * @apiSuccess {String} msg  数据
 * @apiSuccess {Number} status 状态
 */


router.post('/forget',async(req,res)=>{
  let {username,password} = req.body
  let sql = `select username from user where username = '${username}'`
  try {
    let data = await db.query(sql)
    console.log(data);
  /* 用户存在 */
    if (data.length>0) {
      /* 密码加密 */
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async(err, hash) => {
          if (err) throw err;
          password = hash;
          let upadat_password = `update user set password = '${password}' where username = '${username}'`
          /* 插入数据 */
          await db.query(upadat_password)
          res.send(formatData({}))
        });
      });
    }
    else{
      res.send({status:400,msg:'用户不存在'})
    }
  } catch (error) {
    res.send(formatData({
      msg:err,
      status:400
    }))
  }
})




module.exports = router;
