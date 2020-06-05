<template>
  <div class="super-users">
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    搜索-->
    <div style="margin-top: 20px;" v-show="adminPower !==1 ? false : true">
    <el-row :gutter="20">
      <!--        <el-col :span="7">-->
      <!--          <el-input placeholder="搜索管理员" @input="searchAdminUserInput" v-model="searchAdminUser"-->
      <!--                    class="input-with-select" clearable>-->
      <!--            <el-button slot="append" icon="el-icon-search" @click="searchAdminUsers"></el-button>-->
      <!--          </el-input>-->
      <!--        </el-col>-->
      <el-col :span="5">
        <el-button type="primary" @click="addAdminUsers" :disabled="adminPower === 1 ? false : true">添加管理员</el-button>
      </el-col>
    </el-row>
  </div>
    <!--    表格-->
    <el-card class="box-card" v-show="adminPower!==1 ? false : true" v-loading="isLoading">
      <el-table
              :data="tableData"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="index"
                label="#"
                width="50">
        </el-table-column>
        <el-table-column
                prop="adminAccount"
                label="用户名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="adminPassword"
                label="密码"
                width="180">
        </el-table-column>
        <el-table-column
                prop="adminName"
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                sortable
                width="180"
                prop="adminLastTime"
                label="最后登录时间">
          <template slot-scope="scope">
            {{scope.row.adminLastTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
                label="状态"
                align="center">
          <template>
            <el-tag>
              {{'正常'}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
                prop="adminIp"
                label="ip"
                width="180">
        </el-table-column>

        <el-table-column
                label="操作"
                width="170">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editUser(scope.row.adminId)"
                       :disabled="(adminPower === 1 ? false : true) || (scope.row.adminAccount=== 'admin')">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row.adminId)"
                       :disabled="(adminPower === 1 ? false : true) || (scope.row.adminAccount=== 'admin')">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--    分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="AdminUsersParams.pageNum"
              :page-sizes="[5,10,20]"
              :page-size="AdminUsersParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataLength">
      </el-pagination>
    </el-card>


    <!--    编辑弹窗-->
    <el-dialog
            title="编辑管理员"
            :visible.sync="editDialogVisible"
            width="30%"
            :before-close="handleClose"
    >
      <!--      内容模块-->
      <el-form :model="editAdminUserData" status-icon ref="editUserForm"
               label-width="100px" class="demo-ruleForm" :rules="editAdminRules">
        <el-form-item label="用户名" prop="adminAccount">
          <el-input type="text" v-model="editAdminUserData.adminAccount" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="adminPassword">
          <el-input type="text" v-model="editAdminUserData.adminPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="adminPasswordAgain">
          <el-input type="text" v-model="editAdminUserData.adminPasswordAgain" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="adminName">
          <el-input type="text" v-model="editAdminUserData.adminName" clearable></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditUser">确 定</el-button>
      </span>
    </el-dialog>


    <!--    添加弹窗-->
    <el-dialog
            title="添加管理员"
            :visible.sync="addUserDialogVisible"
            width="30%"
            @close="closeAddUserDialog"
            :before-close="handleClose"
    >
      <!--      添加管理员表单内容-->
      <el-form :model="addAdminUserData" status-icon ref="addUserForm"
               label-width="100px"
               :rules="addAdminRules"
               class="demo-ruleForm"
               label-position="left">
        <el-form-item label="姓名：" prop="adminName">
          <el-input v-model="addAdminUserData.adminName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="adminAccount">
          <el-input v-model="addAdminUserData.adminAccount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="adminPassword">
          <el-input v-model="addAdminUserData.adminPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="adminPasswordAgain">
          <el-input v-model="addAdminUserData.adminPasswordAgain" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="addUserDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitAddUser">确 定</el-button>
          </span>
    </el-dialog>

    <not-found class="not-found" v-show="adminPower===1 ? false : true"/>
  </div>
</template>

<script>
  import {
    getAllSuperUsers,
    deleteAdminUsersById,
    editAdminUser,
    getSingleAdminById,
    addAdminUser,
    getRuleSuperUsers
  } from "network/super_users";
  import {Base64} from 'js-base64'

  import NotFound from 'views/404'

  export default {
    name: "SuperUsers",
    components: {
      NotFound
    },
    data() {
      // 添加用户  输入框校验
      let validateUser = (rule, value, callback) => {
        if (!/^[a-zA-Z0-9_-]{3,11}$/.test(value)) {
          callback(new Error("用户名必须是字母，数字，下划线组成！"));
        } else {
          callback();
        }
      };
      //添加密码  输入框校验
      let validatePassWord = (rule, value, callback) => {
        if (!/^[a-zA-Z0-9_-]{3,11}$/.test(value)) {
          callback(new Error("密码必须是字母，数字，下划线组成！"));
        } else {
          callback();
        }
      };
      //添加再次输入密码  输入框校验
      let validatePassWordAgain = (rule, value, callback) => {
        if (value !== this.editAdminUserData.adminPassword) {
          callback(new Error("两次输入密码不一样"));
        } else {
          callback();
        }
      };
      let validatePassWordAgain2 = (rule, value, callback) => {
        if (value !== this.addAdminUserData.adminPassword) {
          callback(new Error("两次输入密码不一样"));
        } else {
          callback();
        }
      };
      return {
        tableData: [],
        tableDataLength: 0,
        AdminUsersParams: {
          pageNum: 1,
          pageSize: 5
        },
        isLoading: true,
        searchAdminUser: "",
        editDialogVisible: false,
        editAdminUserData: {},
        isEditUserId: null,

        addUserDialogVisible: false,
        adminPower: null,
        addAdminUserData: {
          adminAccount: "",
          adminPassword: "",
          adminPasswordAgain: "",
          adminName: "",
        },
        editAdminRules: {
          adminAccount: [
            {required: true, trigger: "change", message: "请输入用户名"},
            {min: 3, max: 11, message: "用户名不得低于3位且不超过11位", trigger: "change"},
            {validator: validateUser, trigger: "change"}
          ],
          adminPassword: [
            {required: true, trigger: "change", message: "请输入密码"},
            {min: 3, max: 11, message: "密码不得低于3位且不超过11位", trigger: "change"},
            {validator: validatePassWord, trigger: "change"}
          ],
          adminPasswordAgain: [
            {required: true, trigger: "change", message: "请确认密码"},
            {validator: validatePassWordAgain, trigger: "change"}
          ]
        },
        addAdminRules: {
          adminAccount: [
            {required: true, trigger: "change", message: "请输入用户名"},
            {min: 3, max: 11, message: "用户名不得低于3位且不超过11位", trigger: "change"},
            {validator: validateUser, trigger: "change"}
          ],
          adminPassword: [
            {required: true, trigger: "change", message: "请输入密码"},
            {min: 3, max: 11, message: "密码不得低于3位且不超过11位", trigger: "change"},
            {validator: validatePassWord, trigger: "change"}
          ],
          adminPasswordAgain: [
            {required: true, trigger: "change", message: "请确认密码"},
            {validator: validatePassWordAgain2, trigger: "change"}
          ]
        }
      };
    },
    computed: {
      addUserFormRef() {
        return this.$refs.addUserForm;
      },
      editUserFormRef() {
        return this.$refs.editUserForm;
      },
    },
    methods: {
      //初始化管理员信息
      async getSuperUsersData() {
        try {
          let token = localStorage.getItem('token')
          if (token) {
            let d = await getAllSuperUsers(token)
            //获取长度
            this.tableDataLength = d.length
            let data = await getRuleSuperUsers(this.AdminUsersParams.pageNum, this.AdminUsersParams.pageSize, token)
            this.tableData = data.data
            this.isLoading = false
          } else {
            this.$router.push('/login')
          }
        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应错误！'
          })
        }
        // getRuleSuperUsers(this.AdminUsersParams.pageNum, this.AdminUsersParams.pageSize)
        //   .then(d => {
        //     this.tableData = d.data;
        //   });
      },


      //删除单个管理员
      deleteUser(ds) {
        this.$confirm("您确定要删除该管理员吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let token = localStorage.getItem('token')
          if (token) {
            let d = await deleteAdminUsersById(ds, token)
            console.log(d);
            if (d.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })

              this.getSuperUsersData()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败，权限不足'
              })
            }
          } else {
            this.$router.push('/login')
          }
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      },


      //获取管理员权限
      getPowerByAdmin() {
        let power = Base64.decode(localStorage.getItem('power'))
        this.adminPower = parseInt(power.replace(/lancer/g, ''))
      },


      //编辑单个管理员
      async editUser(d) {
        this.editDialogVisible = true;
        this.isEditUserId = d
        let data = await getSingleAdminById(d)
        let {adminAccount, adminName, adminPassword} = data
        this.$set(this.editAdminUserData, 'adminAccount', adminAccount)
        this.$set(this.editAdminUserData, 'adminName', adminName)
        this.$set(this.editAdminUserData, 'adminPassword', adminPassword)
        this.$set(this.editAdminUserData, 'adminPasswordAgain', adminPassword)
      },
      //确认编辑
      submitEditUser() {
        this.editUserFormRef.validate(async r => {
          //如果校验成功  提交表单
          if (r) {
            let token = localStorage.getItem('token')
            if (token) {
              let {adminName, adminAccount, adminPassword} = this.editAdminUserData
              try {
                let d = await editAdminUser({adminId: this.isEditUserId, adminName, adminAccount, adminPassword}, token)
                if (d.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '更新成功！'
                  })
                  this.editDialogVisible = false;
                  //更新表格
                  this.getSuperUsersData()
                } else {
                  this.$message({
                    type: 'error',
                    message: '更新失败！'
                  })
                }
              } catch (e) {
                this.$message({
                  type: 'error',
                  message: '服务器响应错误！'
                })
              }
            } else {
              this.$router.push('/login')
            }
          } else {
            this.$message({
              type: 'warning',
              message: '请检查表单信息是否准确！'
            })
          }
        });
      },


      // 添加单个管理员
      addAdminUsers() {
        this.addUserDialogVisible = true;
      },

      //确认添加管理员
      submitAddUser() {
        this.$refs.addUserForm.validate(async r => {
          //校验成功  传数据
          if (r) {
            let token = localStorage.getItem('token')
            if (token) {
              try {
                let {adminName, adminAccount, adminPassword} = this.addAdminUserData
                let d = await addAdminUser({adminName, adminAccount, adminPassword}, token)
                if (d.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '添加成功！'
                  })

                  //刷新列表
                  this.getSuperUsersData()
                  this.addUserDialogVisible = false
                } else {
                  this.$message({
                    type: 'success',
                    message: '添加失败！'
                  })
                }
              } catch (e) {
                this.$message({
                  type: 'error',
                  message: '服务器错误！'
                })
              }
            } else {
              this.$router.push('/login')
            }
          } else {
            this.$message({
              type: "error",
              message: "请检查表单是否填写准确完整！",
              duration: 2000
            });
          }
        });
      },

      // 关闭添加的dialog  重置表单数据
      closeAddUserDialog() {
        this.addAdminUserData = {
          adminAccount: "",
          adminPassword: "",
          adminPasswordAgain: "",
          adminName: "",
        };
      },

      // 关闭前的回调
      handleClose(done) {
        this.$confirm("确认关闭？")
            .then(_ => {
              done();
            })
            .catch(_ => {
            });
      },


      //更改当前页
      handleCurrentChange(val) {
        this.AdminUsersParams.pageNum = val;
        this.isLoading = true
        this.getSuperUsersData();
      },
      //更改每页条数
      handleSizeChange(val) {
        this.AdminUsersParams.pageSize = val;
        this.isLoading = true
        this.getSuperUsersData();
      },


    },


    created() {


      this.getSuperUsersData();

      //获取用户权限
      this.getPowerByAdmin()

      if (this.adminPower !== 1) {
        this.$message({
          type: 'error',
          message: '抱歉！您没有权限访问！'
        })
      }
    }

  };
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .15);
  }

  .el-pagination {
    margin-top: 20px;
  }

  .not-found {
    top: 50%;
    left: 60%;
  }
</style>