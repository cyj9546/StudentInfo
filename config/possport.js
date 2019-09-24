const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const db=require('../db/connect')
const keys = require('./key')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
    let sql = `select * from user where id = ${jwt_payload.id}`
    let data=await db.query(sql);

    if (data.length>0) {
      return done(null,data[0]);
    }else{
      return done(null,false);
    }


  }));
}