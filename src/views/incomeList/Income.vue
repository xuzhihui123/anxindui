<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/incomeList' }">收入记录表</el-breadcrumb-item>
      <el-breadcrumb-item>收入记录表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    查询组件-->

    <!--       头部搜索-->
    <el-form :inline="true" :model="searchIncomeSele" class="demo-form-inline" style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <el-form-item>
        <el-input v-model="searchIncomeSele.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchIncomeSele.phone" placeholder="请输入手机号码" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchIncomeSele.role" placeholder="请选择级别">
          <el-option label="会员" value="member"></el-option>
          <el-option label="代理" value="proxy"></el-option>
          <el-option label="机构" value="org"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
                v-model="searchIncomeSele.time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                align="left"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitSearchIncomeList">确认</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goBackSearch">返回</el-button>
      </el-form-item>
    </el-form>

    <!--    表格开始-->
    <el-card class="box-card" v-loading="isLoading" v-show="adminPower===1 ? true : false">
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
                prop="userBankUsername"
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="userPhone"
                label="手机号码"
                width="180">
        </el-table-column>
        <el-table-column
                width="180"
                prop="userRole"
                align="center"
                label="级别">
          <template slot-scope="scope">
            <el-tag :type="scope.row.userRole==='会员' ? 'success' : 'danger'">{{scope.row.userRole}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                sortable
                width="180"
                prop="inTime"
                label="收入时间">
        </el-table-column>
        <el-table-column
                prop="inMoney"
                label="收入金额"
                width="180">
        </el-table-column>
        <el-table-column
                prop="inMsg"
                label="备注"
                align="center"
        >
        </el-table-column>

      </el-table>
      <!--    分页-->
      <el-pagination
              v-show="!isShowPag2"
              style="margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="IncomeListParams.pageIndex"
              :page-sizes="[5,10,15,20]"
              :page-size="IncomeListParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="incomeListTotal">
      </el-pagination>

      <el-pagination
              v-show="isShowPag2"
              style="margin-top: 20px"
              @size-change="handleSizeChanges"
              @current-change="handleCurrentChanges"
              :current-page="IncomeListParamss.pageNum"
              :page-sizes="[5,10,15,20]"
              :page-size="IncomeListParamss.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="incomeListTotals">
      </el-pagination>
    </el-card>

    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {getIncomeListByRule, selectIncomeInfo} from 'network/income'
  import show from '@/mixs/show'
  export default {
    name: "Income",
    mixins: [show],
    data() {
      return {
        searchIncomeSele: {
          userName: '',
          phone: '',
          role: '',
          time: null
        },
        //加载表格
        isLoading: false,
        //分页
        IncomeListParams: {
          pageIndex: 1,
          pageSize: 5
        },
        IncomeListParamss: {
          pageNum: 1,
          pageSize: 5
        },
        //列表总数
        incomeListTotal: 0,
        incomeListTotals: 0,
        //表格数据总数
        tableData: [],

        isShowPag2: false


      }
    },
    methods: {


      //查询方法
      async submitSearchIncomeList() {
        //如果所有的都为空直接不做任何操作
        if (!this.searchIncomeSele.userName.trim() && !this.searchIncomeSele.phone.trim() && !this.searchIncomeSele.role && !this.searchIncomeSele.time) {
          this.isShowPag2 = false
          this.$message({
            type: 'warning',
            message: "请选择条件查询！"
          })
          return this.getIncomeBaseList()
        }


        this.isLoading = true
        this.tableData = []
        let before;
        let after;
        if (!this.searchIncomeSele.time) {
          before = ''
          after = ''
        } else {
          before = this.searchIncomeSele.time[0]
          after = this.searchIncomeSele.time[1]
        }
        try {
          let d = await selectIncomeInfo({
            userName: this.searchIncomeSele.userName.trim(),
            phone: this.searchIncomeSele.phone.trim(),
            role: this.searchIncomeSele.role,
            before,
            after,
            pageSize: this.IncomeListParamss.pageSize,
            pageNum: this.IncomeListParamss.pageNum
          })
          if (d.data[0].length === 0) {
            this.$message({
              type: 'warning',
              message: '搜索到0条数据！'
            })
            this.isShowPag2 = false
            this.getIncomeBaseList()
          } else {
            this.isShowPag2 = true

            this.incomeListTotals = d.data[1]

            d.data[0].forEach(item => {
              let flagO = {}
              switch (item.userInfo.userRole) {
                case 'member':
                  flagO.userRole = '会员';
                  break;
                case 'proxy':
                  flagO.userRole = '代理';
                  break;
                case 'org':
                  flagO.userRole = '机构'
                  break;
              }
              flagO.userBankUsername = item.userInfo.userBankUsername
              flagO.userPhone = item.userInfo.userPhone
              flagO.inTime = item.inTime
              flagO.inMoney = item.inMoney
              flagO.inMsg = item.inMsg
              this.tableData.push(flagO)
            })

            this.isLoading = false
          }
        } catch (e) {
          this.isShowPag2 = false
          this.isLoading = false
          this.getIncomeBaseList()
          return this.$message({
            type: 'warning',
            message: '服务器响应失败！'
          })
        }
      },


      //获取  分页列表
      async getIncomeBaseList() {
        try {
          this.tableData = []
          this.isLoading = true;
          let d = await getIncomeListByRule(this.IncomeListParams.pageIndex, this.IncomeListParams.pageSize)
          this.incomeListTotal = d.data[1]
          let data = d.data[0]
          data.forEach(item => {
            let flagO = {}
            switch (item.userInfo.userRole) {
              case 'member':
                flagO.userRole = '会员';
                break;
              case 'proxy':
                flagO.userRole = '代理';
                break;
              case 'org':
                flagO.userRole = '机构'
                break;
            }
            flagO.userBankUsername = item.userInfo.userBankUsername
            flagO.userPhone = item.userInfo.userPhone
            flagO.inTime = item.inTime
            flagO.inMoney = item.inMoney
            flagO.inMsg = item.inMsg
            this.tableData.push(flagO)
          })
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false
          this.$message({
            type: 'warning',
            message: '服务器响应失败！'
          })
        }
      },

      //更改当前页
      handleCurrentChange(val) {
        this.IncomeListParams.pageIndex = val;
        this.getIncomeBaseList();
      },
      //更改每页条数
      handleSizeChange(val) {
        this.IncomeListParams.pageSize = val;
        this.getIncomeBaseList();
      },


      handleCurrentChanges(val) {
        this.IncomeListParamss.pageNum = val;
        this.submitSearchIncomeList();
      },
      //更改每页条数
      handleSizeChanges(val) {
        this.IncomeListParamss.pageSize = val;
        this.submitSearchIncomeList();
      },


      //返回搜索
      goBackSearch() {
        this.isShowPag2 = false
        this.IncomeListParamss.pageNum = 1;
        this.IncomeListParamss.pageSize = 5;
        this.searchIncomeSele.userName = ''
        this.searchIncomeSele.phone = ''
        this.searchIncomeSele.role = ''
        this.searchIncomeSele.time = null
        this.getIncomeBaseList();
      }
    },
    created() {
      this.getIncomeBaseList()
    },
    components: {}
  }
</script>

<style scoped lang="less">
  /deep/ .el-date-editor .el-range-separator {
    width: 8%;
  }

  .box-card {
    margin-top: 20px;
  }
</style>