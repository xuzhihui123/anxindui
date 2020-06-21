<template>
  <div class="user-list">
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/users'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--       头部搜索-->
    <el-form
      :inline="true"
      :model="searchUserRules"
      class="demo-form-inline"
      style="margin-top: 20px"
      v-show="adminPower===1 ? true : false"
    >
      <el-form-item>
        <el-input v-model="searchUserRules.phone" placeholder="请输入手机号码" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchUserRules.status" placeholder="请选择状态">
          <el-option label="正常" value="normal"></el-option>
          <el-option label="冻结" value="userFreeze"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchUserRules.userName" placeholder="请输入姓名" type="text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchUserRules.isCommitOrder" placeholder="请选择报单选项">
          <el-option label="无提交报单记录" :value="0"></el-option>
          <el-option label="有提交报单记录" :value="1"></el-option>
          <el-option label="所有" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitSearchUserList">确认</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goBackSearch">返回</el-button>
      </el-form-item>
    </el-form>

    <!--    表格-->
    <el-card class="box-card" v-loading="isLoading" v-show="adminPower===1 ? true : false">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="userPhone" label="用户手机号码" width="180"></el-table-column>
        <el-table-column prop="userCode" label="用户邀请码" width="100"></el-table-column>
        <el-table-column prop="userWithdrawal" label="可提现金额" width="120"></el-table-column>
        <el-table-column prop="userUnWithdrawal" label="不可提现金额" width="120"></el-table-column>
        <el-table-column label="用户级别" align="center" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.userRole === '会员' ? '' : 'success'">{{scope.row.userRole}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userBankAccount" label="支付宝账户" width="180"></el-table-column>
        <el-table-column prop="userBankUsername" label="支付宝姓名" width="120"></el-table-column>

        <el-table-column prop="userCreateTime" label="用户创建时间" width="180"></el-table-column>

        <el-table-column prop="userScore" label="用户积分" width="180"></el-table-column>

        <el-table-column label="用户状态" width="180">
          <template slot-scope="scope">
            <el-tag :type="scope.row.userStatus === 'userFreeze' ? 'danger' : 'success'">
              {{scope.row.userStatus ===
              'userFreeze' ? '已冻结'
              : '正常'}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editUser(scope.row.userId)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--    分页-->
      <el-pagination
        v-show="!isShowSearchPage"
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParamsPage.pageNum"
        :page-sizes="[5,10,15,20]"
        :page-size="userParamsPage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataLength"
      ></el-pagination>

      <!--      搜索分页-->
      <el-pagination
        v-show="isShowSearchPage"
        style="margin-top: 20px"
        @size-change="handleSearchSizeChange"
        @current-change="handleSearchCurrentChange"
        :current-page="userSearchParamsPage.pageNum"
        :page-sizes="[5,10,15,20]"
        :page-size="userSearchParamsPage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableSearchDataLength"
      ></el-pagination>
    </el-card>

    <!--    编辑弹窗-->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <!--      内容模块-->
      <el-form
        :model="editUserData"
        status-icon
        ref="editUserForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="editUserDataRules"
      >
        <el-form-item label="冻结选择" prop="region">
          <el-select v-model="editUserData.region" placeholder="用户冻结解冻选项">
            <el-option label="冻结" value="0"></el-option>
            <el-option label="解冻" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUser">确 定</el-button>
      </span>
    </el-dialog>
    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%" />
  </div>
</template>

<script>
// 导入network
import {
  getUserListByPage,
  unFreezeUser,
  freezeUser,
  selectUserByBlur
} from "network/users";
import show from "@/mixs/show";

export default {
  name: "Users",
  mixins: [show],
  data() {
    return {
      //用户列表分页
      userParamsPage: {
        pageNum: 1,
        pageSize: 5
      },
      tableDataLength: null,
      isLoading: false,
      tableData: [],
      //编辑弹窗
      editDialogVisible: false,
      //用户id
      userId: null,

      editUserData: {
        region: null
      },
      editUserDataRules: {
        region: [{ required: true, message: "请选择操作！" }]
      },

      //搜索数据
      searchUserRules: {
        phone: "",
        status: null,
        userName: "",
        isCommitOrder: null
      },
      //用户搜索分页
      userSearchParamsPage: {
        pageNum: 1,
        pageSize: 5
      },
      //搜索分页总数
      tableSearchDataLength: null,

      //显示搜索 分页
      isShowSearchPage: false
    };
  },
  methods: {
    //获取用户列表信息
    async getUserListByPages() {
      this.isLoading = true;
      try {
        let d = await getUserListByPage(
          this.userParamsPage.pageNum,
          this.userParamsPage.pageSize
        );
        let tableDatas = d.data[0];
        tableDatas.forEach(item => {
          let userR = item.userRole;
          let userRoles;
          switch (userR) {
            case "member":
              userRoles = "会员";
              break;
            case "proxy":
              userRoles = "代理";
              break;
            case "org":
              userRoles = "机构";
              break;
          }
          item.userRole = userRoles;
        });
        this.tableData = tableDatas;
        this.tableDataLength = d.data[1];
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        this.$message({
          type: "warning",
          message: "服务器响应失败！"
        });
      }
    },

    //更改当前页
    handleCurrentChange(val) {
      this.userParamsPage.pageNum = val;
      this.getUserListByPages();
    },
    //更改每页条数
    handleSizeChange(val) {
      this.userParamsPage.pageSize = val;
      this.getUserListByPages();
    },

    //搜索
    handleSearchCurrentChange(val) {
      this.userParamsPage.pageNum = val;
      this.submitSearchUserList();
    },
    //更改每页条数
    handleSearchSizeChange(val) {
      this.userParamsPage.pageSize = val;
      this.submitSearchUserList();
    },

    //编辑用户
    editUser(id) {
      this.userId = id;
      //显示编辑
      this.editDialogVisible = true;
    },

    //确认编辑用户
    submitEditUser() {
      this.$refs.editUserForm.validate(async r => {
        if (!r) {
          return this.$message({
            type: "warning",
            message: "请检查表单信息和操作！"
          });
        } else {
          let v = this.editUserData.region;
          if (v === "0") {
            //调用冻结选项
            try {
              let d = await freezeUser(this.userId);
              if (d.code === 200) {
                this.editDialogVisible = false;
                this.getUserListByPages();
                return this.$message({
                  type: "success",
                  message: "冻结成功！"
                });
              } else {
                return this.$message({
                  type: "warning",
                  message: "冻结失败！"
                });
              }
            } catch (e) {
              return this.$message({
                type: "warning",
                message: "服务器响应失败！"
              });
            }
          } else if (v === "1") {
            //调用解冻
            try {
              let d = await unFreezeUser(this.userId);
              if (d.code === 200) {
                this.editDialogVisible = false;
                this.getUserListByPages();
                return this.$message({
                  type: "success",
                  message: "解冻成功！"
                });
              } else {
                return this.$message({
                  type: "warning",
                  message: "解冻失败！"
                });
              }
            } catch (e) {
              return this.$message({
                type: "warning",
                message: "服务器响应失败！"
              });
            }
          }
        }
      });
    },

    // 关闭前的回调
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.userId = null;
          done();
        })
        .catch(_ => {});
    },

    //确认搜索
    async submitSearchUserList() {
      this.isLoading = true;
      let { phone, status, userName, isCommitOrder } = this.searchUserRules;
      let { pageNum, pageSize } = this.userSearchParamsPage;
      if (!phone && !status && !userName && typeof isCommitOrder !== "number") {
        this.isLoading = false;
        return this.$message({
          type: "warning",
          message: "请输入搜索内容！"
        });
      }
      try {
        let d = await selectUserByBlur({
          phone,
          status,
          userName,
          isCommitOrder,
          pageNum,
          pageSize
        });
        let [data, count] = d.data;
        if (data.length === 0 && count === 0) {
          this.isLoading = false;
          return this.$message({
            type: "warning",
            message: "暂未搜索到相关条件的内容！"
          });
        } else {
          this.$message({
            type: "success",
            message: "查询成功！"
          });
          let tableDatas = data;
          tableDatas.forEach(item => {
            let userR = item.userRole;
            let userRoles;
            switch (userR) {
              case "member":
                userRoles = "会员";
                break;
              case "proxy":
                userRoles = "代理";
                break;
              case "org":
                userRoles = "机构";
                break;
            }
            item.userRole = userRoles;
          });
          this.tableData = tableDatas;
          this.isLoading = false;
          this.tableSearchDataLength = count;
          this.isShowSearchPage = true;
        }
      } catch (e) {
        this.isLoading = false;
        return this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    },

    //返回
    goBackSearch() {
      //设置搜索的分页数为 原来的
      this.userSearchParamsPage.pageNum = 1;
      this.userSearchParamsPage.pageSize = 5;

      this.searchUserRules.phone = "";
      this.searchUserRules.userName = "";
      this.searchUserRules.isCommitOrder = null;
      this.searchUserRules.status = null;

      //隐藏搜索分页
      this.isShowSearchPage = false;
      //重新调用原来的
      this.getUserListByPages();
    }
  },
  created() {
    this.getUserListByPages();
  }
};
</script>

<style scoped lang="less">
</style>