<template>
    <div class="register">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">忘记密码</span>
            </div>
            <el-form :model="forgetUser" :rules="rules" class="forgetForm" ref="forgetForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="forgetUser.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input v-model="forgetUser.password" placeholder="请输入新密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="forgetUser.password2" placeholder="请确认密码" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  class="submit_btn" @click="submitForm('forgetForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
export default {
  name: "forget",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.forgetUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      forgetUser: {
        username: "",
        password: "",
        password2: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "change" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ],
        // email: [
        //   {
        //     type: "email",
        //     required: true,
        //     message: "邮箱格式不正确",
        //     trigger: "blur"
        //   }
        // ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ],
        password2: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 30,
            message: "长度在 6 到 30 个字符",
            trigger: "blur"
          },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
  
      this.$refs[formName].validate(valid => {
        console.log(valid)
        console.log(this.forgetUser)
        if (valid) {
          this.$axios
            .post("/api/user/forget", this.forgetUser)
            .then(res => {
              console.log(res.data)
              // 注册成功
              if(res.data.status == 200){
                this.$message({
                message: "修改成功！",
                type: "success"
              });
               this.$router.push("/login");
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
    }
  }
};
</script>


<style scoped>
.register {
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
  top: 10%;
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
.forgetForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
</style>



