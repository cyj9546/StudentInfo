# 成绩管理系统(vue+express)

## 描述

前面用express+mongodb做了个资金管理的，试着换成mysql做了这个学生成绩管理.简单的实现了下单点登录的功能

## 主要技术栈

VueCli3.0

vue-router

vuex

axios

element-ui

node.js

express

mysql

### 跨域相关

前端用了代理的方式实现跨域

```
    devServer: {
        open: true,
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                target: 'http://localhost:3000/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => { }
    }
```



### 路由拦截

```
// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
    endLoading()
    return response
}, error => {
    // 错误提醒
    endLoading()
  //  Message.error(error.response.data)
    const { status } = error.response
    if (status == 401) {
        Message.error('token值无效，请重新登录')
        // 清除token
        localStorage.removeItem('eleToken')

        // 页面跳转
        router.push('/login')
    }
    return Promise.reject(error)
})
```

```
//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})
```



### 设置请求头



```
// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
    // 加载
    startLoading()
    if (localStorage.eleToken)
        config.headers.Authorization = localStorage.eleToken
    return config
}, error => {
    return Promise.reject(error)
})
```

### 数据库连接

```
var mysql = require("mysql")
var pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"student"
})//数据库连接配置

//数据库查询封装
exports.query = (sql)=>{
    return new Promise((resolve,reject)=>{
        pool.query(sql,(err,results,fields)=>{
            if(err){
                console.log(err)
                return reject(err)
            }
            resolve(results);
        })
    })
    
}
```

### jwt实现token

安装jwt

```
npm install jsonwebtoken
```

安装bcrypt

```
npm install bcrypt
```

密码加密

```
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json({status:200,msg:user}))
                .catch(err => console.log(err));
            });
          });
```

密码匹配返回token

```
      // 密码匹配
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
        //加密规则
          const rule = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            identity: user.identity
          };
          jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
              status:200,
              success: true,
              token: 'Bearer ' + token
            });
          });
        } else {
          return res.send({status:400,msg:"密码错误!"});
        }
      });
```

passport验证token

安装 passport

```
npm install passport-jwt passport
```

验证 token,实现单点登录

```
app.use('/api/grade', passport.authenticate('jwt', { session: false }),async(req,res,next)=>{
	let sql = `select login_time,token from online,user where user.id=${req.user.id} and user.id = online.uid`
	let data = await db.query(sql)
	let login_time =parseInt(data[0].login_time)+60*60*1000
	if (req.headers.authorization == data[0].token) {
		if (Date.now() <= login_time) {
			console.log("token有效");
			let new_login_time_sql = `update online set login_time = '${Date.now()}' where uid = ${req.user.id}`
			await db.query(new_login_time_sql)
			next()
		  }else{
			console.log("token过期");
			let sql_detele_token =  `delete from online where uid = ${req.user.id}`
			await db.query(sql_detele_token)
			res.status(401).send({msg:"token过期，请重新登录"})
		  }
	}else{
	  res.status(401).send({msg:"token无效，请重新登录"})
	}
},gradeRouter);
```

