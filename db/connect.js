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