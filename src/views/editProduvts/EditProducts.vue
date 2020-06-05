<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/commandProducts' }">兑换产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑产品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <el-form :model="addItemData" status-icon ref="addItemForm"
               label-width="120px" class="demo-ruleForm" :rules="addItemDataRules">
        <el-form-item label="积分数" prop="itemScore">
          <el-input type="number" v-model="addItemData.itemScore" clearable></el-input>
        </el-form-item>

        <el-form-item label="兑换商品" prop="itemName">
          <el-input type="text" v-model="addItemData.itemName" clearable></el-input>
        </el-form-item>

        <el-form-item label="兑换次数" prop="itemTime">
          <el-input type="text" v-model="addItemData.itemTime" clearable></el-input>
        </el-form-item>

        <el-form-item label="会员价" prop="itemPrice">
          <el-input type="number" v-model="addItemData.itemPrice" clearable></el-input>
        </el-form-item>

        <el-form-item label="代理价" prop="itemProxyPrice">
          <el-input type="number" v-model="addItemData.itemProxyPrice" clearable></el-input>
        </el-form-item>

        <el-form-item label="机构价" prop="itemOrgPrice">
          <el-input type="number" v-model="addItemData.itemOrgPrice" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitEdit" :loading="btnLoading">确认编辑</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {
    updateSingleItem,
    getItemDetailById
  } from 'network/commandBank'
  import show from '@/mixs/show'
  export default {
    name: "EditProducts",
    mixins:[show],
    data() {
      return {
        itemId: null,
        addItemDataRules: {
          itemScore: [
            {required: true, trigger: 'change', message: '请输入积分数'}
          ],
          itemName: [
            {required: true, trigger: 'change', message: '请输入兑换商品'}
          ],
          itemTime: [
            {required: true, trigger: 'change', message: '请输入兑换次数'}
          ],
          itemPrice: [
            {required: true, trigger: 'change', message: '请输入会员价'}
          ],
          itemProxyPrice: [
            {required: true, trigger: 'change', message: '请输入代理价'}
          ],
          itemOrgPrice: [
            {required: true, trigger: 'change', message: '请输入机构价'}
          ]
        },
        addItemData: {
          itemScore: null,
          itemName: null,
          itemTime: null,
          itemPrice: null,
          itemProxyPrice: null,
          itemOrgPrice: null
        },
        btnLoading: false
      }
    },
    methods: {
      //获取itemId 并且赋值
      async getItemId() {
        this.itemId = this.$route.params.itemId
        try {
          let da = await getItemDetailById(this.itemId)
          for (let key in da) {
            this.addItemData[key] = da[key]
          }
        } catch (e) {
          this.$message(
              {
                type: 'error',
                message: '服务器响应失败！'
              }
          )
        }
      },

      //确认编辑
      submitEdit() {
        this.btnLoading = true
        this.$refs.addItemForm.validate(async r => {
          if (r) {
            let {itemScore, itemName, itemTime, itemPrice, itemProxyPrice, itemOrgPrice} = this.addItemData
            try {
              let d = await updateSingleItem(
                  {itemScore, itemName, itemTime, itemPrice, itemProxyPrice, itemOrgPrice, itemId: this.itemId}
              )
              if (d.code === 200) {
                this.btnLoading = false
                this.$message({
                  type: 'success',
                  message: '编辑成功！'
                })
                //跳回产品管理页
                this.$router.push(`/home/commandProducts`)
              } else {
                this.btnLoading = false
                this.$message({
                  type: 'error',
                  message: '编辑失败！'
                })
              }
            } catch (e) {
              this.btnLoading = false
              this.$message({
                type: 'error',
                message: '服务器响应失败！'
              })
            }
          } else {
            this.btnLoading = false
            this.$message(
                {
                  type: 'warning',
                  message: '请检查表单信息！'
                }
            )
          }
        })
      }
    },
    created() {
      this.getItemId()
    }
  }
</script>

<style scoped lang="less">

</style>