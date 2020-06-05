<template>
  <div>
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>提现记录表</el-breadcrumb-item>
      <el-breadcrumb-item>提现记录表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--       头部搜索-->
    <el-form :inline="true" :model="searchWithDrawList" class="demo-form-inline" style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <el-form-item>
        <el-input v-model="searchWithDrawList.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchWithDrawList.phone" placeholder="请输入手机号码" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchWithDrawList.status" placeholder="请选择审核状态">
          <el-option label="审核通过" value="审核通过"></el-option>
          <el-option label="审核不通过" value="审核不通过"></el-option>
          <el-option label="未审核" value="未审核"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
                v-model="searchWithDrawList.time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                align="left"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="sumitWithDrawList">确认</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goBackSearch">返回</el-button>
      </el-form-item>
    </el-form>


    <!--        表格开始-->
    <el-card class="my-card" style="margin-top: 20px" v-loading="tableisLoading" v-show="adminPower===1 ? true : false">
      <el-table
              :data="withdrawListData"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="index"
                label="#"
                width="50">
        </el-table-column>
        <el-table-column
                label="用户电话号码"
                width="150px"
        >
          <template slot-scope="scope">
            {{scope.row.userInfo.userPhone}}
          </template>
        </el-table-column>

        <el-table-column
                prop="wmoney"
                label="提现金额"
        >
        </el-table-column>


        <el-table-column
                label="提现时间"
                width="180"
        >

          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.wcreateTime}}</span>
          </template>
        </el-table-column>

        <el-table-column
                prop="wbankName"
                label="提现银行"
                width="180"
        >
        </el-table-column>


        <el-table-column
                prop="wbankAccount"
                label="提现账户"
                width="200"
        >
        </el-table-column>


        <el-table-column
                prop="wbankUsername"
                label="提现人"
        >
        </el-table-column>


        <el-table-column
                width="100px"
                label="审核状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.wstatus === '审核通过' ? 'success' : 'danger'">{{scope.row.wstatus}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
                width="200px"
                label="管理员审核备注"
                prop="wcheckMsg"
        >
        </el-table-column>

        <el-table-column
                label="操作"
                fixed="right"
                width="200"
                align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.wstatus=== '审核通过' ||scope.row.wstatus=== '审核不通过' "
                       type="success" @click="editWithDraw(scope.row['wid'])"
            >
              <i class="el-icon-edit"></i>审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--    分页-->
      <el-pagination
              v-show="!searchWithShow"
              style="margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="withdrawListPage.pageNum"
              :page-sizes="[5,10,15]"
              :page-size="withdrawListPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataLength">
      </el-pagination>

      <el-pagination
              v-show="searchWithShow"
              style="margin-top: 20px"
              @size-change="handleSizeChanges"
              @current-change="handleCurrentChanges"
              :current-page="withdrawListPages.pageNum"
              :page-sizes="[5,10,15]"
              :page-size="withdrawListPages.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataLengths">
      </el-pagination>
    </el-card>
    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {getWithdrawalListByPage, selectW} from 'network/withdraw'
  import show from '@/mixs/show'

  export default {
    name: "WithdrawList",
    mixins: [show],
    data() {
      return {
        withdrawListData: [],

        tableisLoading: true,
        withdrawListPage: {
          pageNum: 1,
          pageSize: 5
        },
        tableDataLength: null,


        searchWithDrawList: {
          status: '',
          time: null,
          userName: '',
          phone: ''
        },

        //搜索提现  分页的显示和隐藏
        searchWithShow: false,

        //搜索提现的分页
        withdrawListPages: {
          pageNum: 1,
          pageSize: 5
        },
        //提现分页的总数
        tableDataLengths: null
      }
    },
    methods: {
      //分页操作
      //更改当前页
      handleCurrentChange(val) {
        this.withdrawListPage.pageNum = val;
        this.getwithdrawList();
      },
      //更改每页条数
      handleSizeChange(val) {
        this.withdrawListPage.pageSize = val;
        this.getwithdrawList();
      },


      //获取列表
      async getwithdrawList() {
        this.tableisLoading = true
        try {
          let d = await getWithdrawalListByPage(this.withdrawListPage.pageNum, this.withdrawListPage.pageSize)
          if (d.code === 200) {
            this.tableisLoading = false
            this.withdrawListData = d.data[0]
            this.tableDataLength = d.data[1]
          } else {
            this.tableisLoading = false
            this.$message({
              type: 'error',
              message: "获取提现信息失败！"
            })
          }
        } catch (e) {
          this.tableisLoading = false
          this.$message({
            type: 'error',
            message: "服务器响应失败！"
          })
        }
      },

      //审核
      editWithDraw(wid) {
        this.$router.push(`/home/editWithdrawList/${wid}`)
      },


      //查询搜索提现 列表
      async sumitWithDrawList() {
        //显示表格加载 loading
        this.tableisLoading = true
        let {status, time, userName, phone} = this.searchWithDrawList
        if (!status.trim() && !userName.trim() && !phone.trim() && !time) {
          this.$message({
            type: 'warning',
            message: '请输入搜索条件！'
          })
          //不显示 搜索分页
          this.searchWithShow = false
          this.tableisLoading = false
          //重新调用
          this.getwithdrawList()
        } else {
          let before;
          let after;
          if (!this.searchWithDrawList.time) {
            before = ''
            after = ''
          } else {
            before = this.searchWithDrawList.time[0]
            after = this.searchWithDrawList.time[1]
          }
          try {
            //调用模糊查询
            let d = await selectW({
              pageNum: this.withdrawListPages.pageNum,
              pageSize: this.withdrawListPages.pageSize,
              userName,
              phone,
              status,
              before,
              after
            })
            //没有找到查询条件
            if (d.data[0].length === 0) {
              //不显示 搜索分页
              this.searchWithShow = false
              this.tableisLoading = false
              this.$message({
                type: 'warning',
                message: '搜索到0条记录！'
              })
              return this.getwithdrawList()
            }
           //找到的话重新赋值
            this.withdrawListData = d.data[0]
            this.tableDataLengths = d.data[1]
            //显示搜索的分页
            this.searchWithShow = true
            this.tableisLoading = false
          } catch (e) {
            //调用原来的方法
            this.getwithdrawList()
            return this.$message({
              type: 'warning',
              message: '服务器响应失败！'
            })
          }
        }
      },
      //返回
      goBackSearch() {
        //清空提现搜索的表单内容
        this.searchWithDrawList.status = ''
        this.searchWithDrawList.time = null
        this.searchWithDrawList.userName = ''
        this.searchWithDrawList.phone = ''
        this.searchWithShow = false
        this.withdrawListPages.pageNum = 1
        this.withdrawListPages.pageSize = 5
        //调用原来的方法
        this.getwithdrawList()
      },

      //搜索分页操作
      //更改当前页
      handleCurrentChanges(val) {
        this.withdrawListPages.pageNum = val;
      },
      //更改每页条数
      handleSizeChanges(val) {
        this.withdrawListPages.pageSize = val;
      },
    },
    created() {
      this.getwithdrawList()
    },
    activated() {
      this.searchWithDrawList.status = ''
      this.searchWithDrawList.time = null
      this.searchWithDrawList.userName = ''
      this.searchWithDrawList.phone = ''
      this.searchWithShow = false
      this.withdrawListPages.pageNum = 1
      this.withdrawListPages.pageSize = 5
      this.getwithdrawList()
    }
  }
</script>

<style scoped lang="less">

</style>