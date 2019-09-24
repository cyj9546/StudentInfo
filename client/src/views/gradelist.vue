<template>
    <div class="fillcontain">
        <div>
            <el-form
                :inline="true"
                ref="search_data" 
                :model='search_data' >
                 <el-form-item label="成绩查询:">
                    <el-cascader
                        style="width:240px"
                        v-model="value"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button style="" type="primary" size ="small" icon="search" @click='onScreeoutMoney()'>确定</el-button>
                </el-form-item>
                 <el-form-item class="btnRight">
                    <el-button type="primary" size ="small" icon="view" @click='onAddMoney()'>添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data='tableData'
                max-height="450"
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: 100%">
                <el-table-column
                    prop="number"
                    label="学号"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    align='center'
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="school_year"
                    label="学年"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="term"
                    label="学期"
                    align='center'
                    width="150">
                </el-table-column>
                 <el-table-column
                    prop="subject"
                    label="课程"
                    align='center'
                    width="150">
                </el-table-column>
                 <el-table-column
                    prop="course_type"
                    label="课程类别"
                    align='center'
                    width="150">
                </el-table-column>
                 <el-table-column
                    prop="course_nature"
                    label="课程性质"
                    align='center'
                    width="150">
                </el-table-column>
                 <el-table-column
                    prop="score"
                    label="成绩"
                    align='center'
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="180">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning" 
                            icon='edit' 
                            size="small"
                            @click='onEditMoney(scope.row)'
                        >编辑</el-button>
                        <el-button 
                            type="danger" 
                            icon='delete' 
                            size="small"
                            @click='onDeleteMoney(scope.row,scope.$index)'
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
             <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            v-if='paginations.total > 0'
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page.sync='paginations.page_index'
                            @current-change='handleCurrentChange'
                            @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹框页面 -->
        <DialogFound :dialog='dialog' :form='form' @update="getProfile"></DialogFound>
    </div>
</template>

<script>
import DialogFound from "../components/DialogFound";

export default {
  name: "fundlist",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        number: "",
        username: "",
        school_year: "",
        term: "",
        course_nature: "",
        course_type: "",
        subject: "",
        score: ""
        
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        startTime: "",
        endTime: ""
      },
    value: [],
        options: [{
          value: 'zhinan',
          label: '2017--2018',
          children: [{
            value: 'shejiyuanze',
            label: '第一学期',
            children: [{
              value: 'yizhi',
              label: '全部'
            }, {
              value: 'fankui',
              label: '首修'
            }, {
              value: 'xiaolv',
              label: '重修'
            }]
          }, {
            value: 'daohang',
            label: '第二学期',
            children: [{
              value: 'yizhi',
              label: '全部'
            }, {
              value: 'fankui',
              label: '首修'
            }, {
              value: 'xiaolv',
              label: '重修'
            }]
          }]
        }, {
          value: 'zujian',
          label: '2018--2019',
          children: [{
            value: 'shejiyuanze',
            label: '第一学期',
            children: [{
              value: 'yizhi',
              label: '全部'
            }, {
              value: 'fankui',
              label: '首修'
            }, {
              value: 'xiaolv',
              label: '重修'
            }]
          }, {
            value: 'daohang',
            label: '第二学期',
            children: [{
              value: 'yizhi',
              label: '全部'
            }, {
              value: 'fankui',
              label: '首修'
            }, {
              value: 'xiaolv',
              label: '重修'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '2019--2020',
          children: [{
            value: 'shejiyuanze',
            label: '第一学期',
            children: [{
              value: 'yizhi',
              label: '全部'
            }, {
              value: 'fankui',
              label: '首修'
            }, {
              value: 'xiaolv',
              label: '重修'
            }]
          }, {
            value: 'daohang',
            label: '第二学期',
            children: [{
              value: 'yizhi',
              label: '全部'
            }, {
              value: 'fankui',
              label: '首修'
            }, {
              value: 'xiaolv',
              label: '重修'
            }]
          }]
        }]
      };
    },
  components: {
    DialogFound
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 获取表格数据
      this.$axios("/api/grade/info").then(res => {
          console.log(res.data)
          console.log(res.data.data)
        // this.tableData = res.data;
        this.allTableData = res.data.data;
        this.filterTableData = res.data.data;
        // 设置分页数据
        this.setPaginations();
      });
    },
    onEditMoney(row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改学生信息",
        option: "edit"
      };
      console.log( row.number);
      
      this.form = {
        number: row.number,
        username: row.username,
        term: row.term,
        course_nature: row.course_nature,
        school_year: row.school_year,
        course_type: row.course_type,
        subject: row.subject,
        score: row.score
      };

    },
    onDeleteMoney(row, index) {
      // 删除
    //   this.$axios.delete(`/api/profile/delete/${row._id}`).then(res => {
    //     this.$message("删除成功");
    //     this.getProfile();
    //   });
     this.$message.error("权限不足,无法执行此操作");
    },
    onAddMoney() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加学生成绩",
        option: "add"
      };
      this.form = {
        number: "",
        username: "",
        school_year: "",
        term: "",
        course_nature: "",
        course_type: "",
        subject: "",
        score: ""
      };
       this.$message.error("权限不足,无法执行此操作");
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
        console.log(this.allTableData.length)
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutMoney() {
           this.$message.error("此功能暂未实现");
      // 筛选
    //   if (!this.search_data.startTime || !this.search_data.endTime) {
    //     this.$message({
    //       type: "warning",
    //       message: "请选择时间区间"
    //     });
    //     this.getProfile();
    //     return;
    //   }
    //   const stime = this.search_data.startTime.getTime();
    //   const etime = this.search_data.endTime.getTime();
    //   this.allTableData = this.filterTableData.filter(item => {
    //     let date = new Date(item.date);
    //     let time = date.getTime();
    //     return time >= stime && time <= etime;
    //   });
      // 分页数据
    //  this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>