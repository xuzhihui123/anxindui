<template>
  <div v-loading="isShowMain">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/orderList' }">报单记录表</el-breadcrumb-item>
      <el-breadcrumb-item>报单审核</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 20px">
      <el-form :model="editOrderData" status-icon ref="editUserForm"
               label-width="120px" class="demo-ruleForm" disabled>
        <el-form-item label="用户id：" prop="userId">
          <el-input v-model="editOrderData.userId" clearable></el-input>
        </el-form-item>
        <el-form-item label="报单id：" prop="orderId">
          <el-input v-model="editOrderData.orderId" clearable></el-input>
        </el-form-item>

        <el-form-item label="报单创建时间：" prop="orderCreateTime">
          <el-input v-model="editOrderData.orderCreateTime" clearable></el-input>
        </el-form-item>

        <el-form-item label="报单截图：" prop="orderImg">
          <el-image
                  style="width: 100px"
                  :src="editOrderData.orderImg"
                  :preview-src-list="srcList">
          </el-image>
        </el-form-item>

        <el-form-item label="来源银行：" prop="orderBankName">
          <el-input v-model="editOrderData.orderBankName" clearable></el-input>
        </el-form-item>

        <el-form-item label="来源兑换卷：" prop="orderCoinName">
          <el-input v-model="editOrderData.orderCoinName" clearable></el-input>
        </el-form-item>

        <el-form-item label="来源产品：" prop="orderItem">
          <el-input v-model="editOrderData.orderItem" clearable></el-input>
        </el-form-item>

        <el-form-item label="产品价格：" prop="orderFaceValue">
          <el-input v-model="editOrderData.orderFaceValue" clearable></el-input>
        </el-form-item>

        <el-form-item label="兑换积分：" prop="orderScore">
          <el-input v-model="editOrderData.orderScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="兑换码：" prop="orderKey">
          <el-input v-model="editOrderData.orderKey" clearable></el-input>
        </el-form-item>
        <el-form-item label="兑换备注：" prop="orderMsg">
          <el-input v-model="editOrderData.orderMsg" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <!--      审核报单-->
      <el-form :model="submitOrder" label-width="150px" class="demo-ruleForm">
        <el-form-item label="审核：" label-width="150px">
          <el-select v-model="submitOrder.region" placeholder="请审核">
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核不通过" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员审核备注" label-width="150px">
          <el-input type="textarea" v-model="submitOrder.desc" placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item label="推送用户审核原因" label-width="150px">
          <el-input type="textarea" v-model="submitOrder.cause" placeholder="选填，可简写审核失败原因等"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sumbitOrder" :loading="btnLoading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {checkOrder, getOrderById} from 'network/order'
  import moment from 'moment'
  import {Base64} from 'js-base64'

  export default {
    name: "EditOrderList",
    data() {
      return {
        editOrderData: {},
        submitOrder: {
          region: null,
          desc: '',
          cause: ''
        },
        orderId: null,
        isShowMain: true,
        //大图展示
        srcList: [],
        btnLoading: false,
        adminPower: null,
        adminName: null
      }
    },
    methods: {
      async getSingleOrderData() {
        this.orderId = parseInt(this.$route.params.orderId)
        try {
          let d = await getOrderById(this.orderId)
          if (d.status === 200) {
            this.isShowMain = false
            let d1 = d.data[0]
            let d2 = d.data[1]
            Object.assign(this.editOrderData, d1, d2)
            this.srcList.push(d.data[0].orderImg)
          } else {
            this.isShowMain = false
            this.$message({
              type: 'error',
              message: '请求失败！'
            })
          }
        } catch (e) {
          this.isShowMain = false
          this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })

        }
      },


      //获取 审核管理员信息
      getAdminInfo() {
        this.adminPower = parseInt(Base64.decode(localStorage.getItem('power')).replace('lancer', ''))
        if (localStorage.getItem('adminNam')) {
          this.adminName = Base64.decode(localStorage.getItem('adminNam'))
        } else {
          this.adminName = ''
        }
      },

      //确认审核
      async sumbitOrder() {
        this.$confirm('一经审核不可修改', '提示', {
          confirmButtonText: '确定审核',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if (typeof (this.submitOrder.region) !== 'number') {
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
            let checkMsg
            if (this.editOrderData.orderCheckMsg) {
              checkMsg = `${this.editOrderData.orderCheckMsg}，${this.submitOrder.desc}（${adminPowerName}:${this.adminName}）- 审核报单`
            } else {
              checkMsg = `${this.submitOrder.desc}（${adminPowerName}:${this.adminName}）- 审核报单`
            }
            let d = await checkOrder({
              orderId: this.orderId,
              orderCode: this.submitOrder.region,
              checkMsg,
              cause: this.submitOrder.cause
            })
            if (d.code === 500) {
              this.btnLoading = false
              this.$message({
                type: 'warning',
                message: '订单已审核！'
              })
              this.$router.push('/home/orderList')
            } else {
              this.btnLoading = false
              this.$message({
                type: 'success',
                message: '审核成功！'
              })
              this.$router.push('/home/orderList')
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
      //获取表单信息
      this.getSingleOrderData()

      //获取用户信息
      this.getAdminInfo()
    },
  }
</script>

<style scoped lang="less">
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #37a0f4;
  }
</style>