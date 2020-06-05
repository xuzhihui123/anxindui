<template>
  <div v-loading="isShowMain">
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/withdrawList'}">提现记录表</el-breadcrumb-item>
      <el-breadcrumb-item>提现审核</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <el-form :model="editWithdrawData" status-icon ref="editUserForm"
               label-width="120px" class="demo-ruleForm" disabled>
        <el-form-item label="用户id：" prop="userId">
          <el-input v-model="editWithdrawData.wuserId" clearable></el-input>
        </el-form-item>
        <el-form-item label="提现金额：" prop="orderId">
          <el-input v-model="editWithdrawData.wmoney" clearable></el-input>
        </el-form-item>
        <el-form-item label="提现时间：" prop="orderCreateTime">
          <el-input v-model="editWithdrawData.wcreateTime" clearable></el-input>
        </el-form-item>
        <el-form-item label="提现银行：" prop="orderId">
          <el-input v-model="editWithdrawData.wbankName" clearable></el-input>
        </el-form-item>
        <el-form-item label="提现账户：" prop="orderId">
          <el-input v-model="editWithdrawData.wbankAccount" clearable></el-input>
        </el-form-item>
        <el-form-item label="提现人：" prop="orderId">
          <el-input v-model="editWithdrawData.wbankUsername" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <!--      审核报单-->
      <el-form :model="submitWithdraw" label-width="150px" class="demo-ruleForm">
        <el-form-item label="审核：">
          <el-select v-model="submitWithdraw.region" placeholder="请审核">
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核不通过" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="管理员审核备注" label-width="150px">
          <el-input type="textarea" v-model="submitWithdraw.desc" placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item label="推送用户审核原因" label-width="150px">
          <el-input type="textarea" v-model="submitWithdraw.cause" placeholder="选填，可简写审核失败原因等"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sumbitOrders" :loading="btnLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {getWithdrawalById, checkWithdrawal} from 'network/withdraw'
  import getAdminUser from '@/mixs/getAdminUser'
  import moment from "moment";
  import show from '@/mixs/show'
  export default {
    name: "WithDrawListEdit",
    mixins:[show,getAdminUser],
    data() {
      return {
        editWithdrawData: {},
        wid: null,
        isShowMain: true,
        submitWithdraw: {
          region: null,
          desc:'',
          cause:''
        },
        btnLoading: false
      }
    },
    methods: {
      //获取信息填充表单
      async getWithdrawalById() {
        this.wid = parseInt(this.$route.params.wid)
        try {
          let d = await getWithdrawalById(this.wid)
          this.isShowMain = false
          let d1 = d
          d1.wcreateTime = moment(parseInt(d1.wcreateTime)).format("YYYY-MM-DD HH:mm:ss")
          this.editWithdrawData = d1
        } catch (e) {
          this.isShowMain = false
          this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      },

      //sumbitOrder  审核
      sumbitOrders() {
        this.$confirm('一经审核不可修改', '提示', {
          confirmButtonText: '确定审核',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if (typeof (this.submitWithdraw.region) !== 'number') {
            return this.$message({
              type: 'warning',
              message: '请选择审核操作！'
            })
          }
          try {
            this.btnLoading = true
            let adminPowerName
            if (this.adminPower === 1) {
              adminPowerName = '超级管理员'
            } else {
              adminPowerName = '普通管理员'
            }
            let checkMsg = `${this.submitWithdraw.desc}（${adminPowerName}:${this.adminName}）`
            let d = await checkWithdrawal({
              code: this.submitWithdraw.region,
              wId: this.editWithdrawData.wid,
              money: this.editWithdrawData.wmoney,
              userId: this.editWithdrawData.wuserId,
              checkMsg,
              cause:this.submitWithdraw.cause
            })
            console.log(d);
            if (d.code === 200) {
              this.btnLoading = false
              this.$message({
                type: 'success',
                message: '审核成功！'
              })
              this.$router.push('/home/withdrawList')
            } else if(d.code === 500){
              this.$message({
                type: 'warning',
                message: '审核成功！'
              })
              this.$router.push('/home/withdrawList')
            }else {
              this.btnLoading = false
              this.$message({
                type: 'warning',
                message: '审核失败！'
              })
              this.$router.push('/home/withdrawList')
            }
          } catch (e) {
            this.btnLoading = false
            return this.$message({
              type: 'error',
              message: '服务器响应失败！'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审核'
          });
        });
      }
    },
    created() {
      this.getWithdrawalById()
    }
  }
</script>

<style scoped lang="less">

</style>