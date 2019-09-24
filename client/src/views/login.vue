<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">学生成绩查询</span>
            </div>
            <el-form :model="loginUser" :rules="rules" ref="loginForm" class="loginForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginUser.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginUser.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="submitForm('loginForm')" class="submit_btn">登  录</el-button>
                </el-form-item>
                <el-row :gutter="20">
                     <el-col :span="6"><div class="grid-content bg-purple tiparea"><p><router-link to='/forget'>忘记密码</router-link></p></div></el-col>
                     <el-col :span="12" :offset="6"><div class="grid-content bg-purple tiparea"><p>还没有账号？现在<router-link to='/register'>注册</router-link></p></div></el-col>
                </el-row>
            </el-form>
        </section>
    </div>
</template>

<script>
 import jwt_decode from "jwt-decode";

export default {
  name: "login",
  data() {
    return {
      loginUser: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "change" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post("/api/user/login", this.loginUser).then(res => {
             console.log(this.loginUser)
            // 登录成功
            console.log(res.data)
            if (res.data.status == 200) {
           const { token } = res.data;
            console.log(token+'token')
            localStorage.setItem("eleToken", token);

          // 解析token
           const decode = jwt_decode(token);
            console.log(decode)
        //     // 存储数据
            this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));
            this.$store.dispatch("setUser", decode);
                 console.log(this.$store.getters.user)
        //     // 页面跳转
             this.$router.push("/home");    
            }
            else{
                 this.$message.error(res.data.msg);
            }
            
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg1.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: rgb(92, 138, 236);
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
 
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>


