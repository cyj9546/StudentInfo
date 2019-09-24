<template>
    <div class="logFund">
         <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="form" 
                    :model="form"
                    :rules="form_rules"
                    label-width="120px"
                    style="margin:10px;width:auto;">

                    <el-form-item  prop='course_type' label="课程类型:" >
                        <el-select v-model="form.type"  prop='course_type' placeholder="课程类型">
                            <el-option
                            prop='course_type'
                             v-for="(formtype, index) in format_type_list"
                             :key="index" 
                             :label="formtype" :value="formtype"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop='subject' label="课程名称:">
                        <el-input type="subject" v-model="form.subject"></el-input>
                    </el-form-item>

                    <el-form-item prop='number'  label="学号:">
                        <el-input type="number" v-model="form.username"></el-input>
                    </el-form-item>

                    <el-form-item prop='username' label="姓名:">
                        <el-input type="username" v-model="form.username"></el-input>
                    </el-form-item>

                    <el-form-item prop='school_year' label="学年:">
                        <el-select v-model="value" placeholder="请选择">
                              <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                        </el-select>
                    </el-form-item>

                     <el-form-item prop='term' label="学期:">
                        <el-select v-model="value1" placeholder="请选择">
                              <el-option
                                v-for="item in options1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop='course_nature' label="课程性质:">
                        <el-select v-model="value2" placeholder="请选择">
                              <el-option
                                v-for="item in options2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item prop='score' label="总评成绩:">
                        <el-input type="score" v-model="form.score"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    return {
      options: [{
          value: '选项1',
          label: '2017 ~ 2018'
        }, {
          value: '选项2',
          label: '2018 ~ 2019'
        }, {
          value: '选项3',
          label: '2019 ~ 2020'
        }],
        options1: [{
          value: '选项1',
          label: '第一学期'
        }, {
          value: '选项2',
          label: '第二学期'
        }],
         options2: [{
          value: '选项1',
          label: '必修课'
        }, {
          value: '选项2',
          label: '基本素质选修课'
        },
        {
          value: '选项3',
          label: '基本素质课'
        },
        {
          value: '选项4',
          label: '职业能力课'
        }],
        value: '',
         value1: '',
         value2: '',
      format_type_list: [
        "基本素质",
        "职业能力课"
      ],
      form_rules: {
         course_type: [
          { required: true, message: "课程类型不能为空！", trigger: "blur" }
        ],
        subject: [
          { required: true, message: "课程名称不能为空！", trigger: "blur" }
        ],
        number: [
          { required: true, message: "学号不能为空！", trigger: "blur" }
        ],
        score: [
          { required: true, message: "成绩不能为空！", trigger: "blur" }
        ],
        course_nature: [{ required: true, message: "课程性质不能为空！", trigger: "blur" }],
        school_year: [{ required: true, message: "学年不能为空！", trigger: "blur" }],
        term: [{ required: true, message: "学期不能为空！", trigger: "blur" }],
         username: [{ required: true, message: "姓名不能为空！", trigger: "blur" }],
      }
    };
  },
  methods: {
    onSubmit(form) {
       this.$message.error("权限不足,无法执行此操作");
      // this.$refs[form].validate(valid => {
      //   if (valid) {
      //     //表单数据验证完成之后，提交数据;
      //     const url =
      //       this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
      //     this.$axios.post(`/api/profile/${url}`, this.form).then(res => {
      //       // 操作成功
      //       this.$message({
      //         message: "保存成功！",
      //         type: "success"
      //       });
      //       this.dialog.show = false;
      //       this.$emit("update");
      //     });
      //   }
      // });
    }
  }
};
</script>

