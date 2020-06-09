<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/commandCoin' }">兑换卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加优惠劵</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 20px" v-show="adminPower ===1 ? true : false">
      <el-form :model="addCoinData" status-icon ref="editUserForm"
               label-width="120px" class="demo-ruleForm" :rules="addCoinDataRules">
        <el-form-item label="兑换卷名称" prop="coinName">
          <el-input type="text" v-model="addCoinData.coinName" clearable></el-input>
        </el-form-item>
        <el-form-item label="优势" prop="coinMsg">
          <el-input type="text" v-model="addCoinData.coinMsg" clearable></el-input>
        </el-form-item>

        <el-form-item label="起兑单位" prop="coinStart">
          <el-input type="number" v-model="addCoinData.coinStart" clearable></el-input>
        </el-form-item>

        <el-form-item label="兑换次数" prop="coinCount">
          <el-input type="text" v-model="addCoinData.coinCount" clearable></el-input>
        </el-form-item>

        <el-form-item label="会员积分价值" prop="coinKey">
          <el-input type="number" v-model="addCoinData.coinKey" clearable></el-input>
        </el-form-item>

        <el-form-item label="代理积分价值" prop="coinProxyKey">
          <el-input type="number" v-model="addCoinData.coinProxyKey" clearable></el-input>
        </el-form-item>

<!--        <el-form-item label="机构积分价值" prop="coinOrgKey">-->
<!--          <el-input type="number" v-model="addCoinData.coinOrgKey" clearable></el-input>-->
<!--        </el-form-item>-->
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px" v-show="adminPower ===1 ? true : false">
      <edita @getVaue="getValues"/>

      <el-button type="primary" @click="submitAddCoin" :loading="submitLoading"
                 style="margin-top: 40px;margin-left: 90%">确认添加
      </el-button>
    </el-card>


    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {addSingleCoin} from 'network/commandBank'

  //导入封装好的富文本
  import Edita from 'views/Edita'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import show from '@/mixs/show'
  // import {upLoadImg} from 'network/commandBank'
  // import {dataURLtoFile} from 'commonjs/fileToBase64'

  export default {
    name: "AddCoin",
    mixins: [show],
    data() {
      return {
        addCoinData: {
          coinName: null,
          coinMsg: null,
          coinStart: null,
          coinCount: null,
          coinKey: null,
          coinProxyKey: null,
          // coinOrgKey: null
        },
        coinId: null,
        addCoinDataRules: {
          coinName: [
            {required: true, trigger: 'change', message: '请输入兑换卷名称'}
          ],
          coinMsg: [
            {required: true, trigger: 'change', message: '请输入优势'}
          ],
          coinStart: [
            {required: true, trigger: 'change', message: '请输入起兑单位'},
          ],
          coinKey: [
            {required: true, trigger: 'change', message: '请输入会员积分价值'},
          ],
          coinProxyKey: [
            {required: true, trigger: 'change', message: '请输入代理积分价值'},
          ],
          // coinOrgKey: [
          //   {required: true, trigger: 'change', message: '请输入机构积分价值'},
          // ]
        },
        submitLoading: false,

        contentEditor: '',
        editorOption: {
          placeholder: '编辑兑换卷兑换步骤详情'
        }
      }
    },
    methods: {
      //获取
      getCoinId() {
        this.coinId = this.$route.params.bankId
      },

      //确认添加

      submitAddCoin() {
        this.submitLoading = true
        this.$refs.editUserForm.validate(async r => {
          let {coinName, coinMsg, coinStart, coinCount, coinKey, coinProxyKey} = this.addCoinData
          if (r) {
            try {
              let d = await addSingleCoin({
                coinBankId: this.coinId, coinName, coinMsg, coinStart,
                coinCount, coinKey, coinProxyKey, coinOrgKey:coinProxyKey, coinText:this.contentEditor
              })
              if (d.code === 200) {
                this.submitLoading = false
                this.$message(
                    {
                      type: 'success',
                      message: '兑换卷添加成功！'
                    }
                )
                this.$router.push('/home/commandCoin')
              } else {
                this.submitLoading = false
                this.$message(
                    {
                      type: 'error',
                      message: '兑换卷添加失败！'
                    }
                )
              }
            } catch (e) {
              this.submitLoading = false
              this.$message(
                  {
                    type: 'error',
                    message: '服务器响应失败！'
                  }
              )
            }

          } else {
            this.submitLoading = false
            this.$message(
                {
                  type: 'warning',
                  message: '请检查表单信息是否准确！'
                }
            )
          }
        })
      },


      getValues(values) {
        this.contentEditor = values
      },



    },
    components: {
      Edita
    },
    created() {
      this.getCoinId()
    }
  }
</script>

<style scoped lang="less">

</style>