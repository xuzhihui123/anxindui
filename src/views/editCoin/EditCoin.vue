<template>
  <div v-loading="isShowMain">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/commandCoin' }">兑换卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑优惠劵</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <el-form :model="eidtCoinData" status-icon ref="editUserForm"
               label-width="120px" class="demo-ruleForm" :rules="addEditDataRules">
        <el-form-item label="兑换卷名称" prop="coinName">
          <el-input type="text" v-model="eidtCoinData.coinName" clearable></el-input>
        </el-form-item>
        <el-form-item label="优势" prop="coinMsg">
          <el-input type="text" v-model="eidtCoinData.coinMsg" clearable></el-input>
        </el-form-item>

        <el-form-item label="起兑单位" prop="coinStart">
          <el-input type="number" v-model="eidtCoinData.coinStart" clearable></el-input>
        </el-form-item>

        <el-form-item label="兑换次数" prop="coinCount">
          <el-input type="text" v-model="eidtCoinData.coinCount" clearable></el-input>
        </el-form-item>

        <el-form-item label="会员积分价值" prop="coinKey">
          <el-input type="number" v-model="eidtCoinData.coinKey" clearable></el-input>
        </el-form-item>

        <el-form-item label="代理积分价值" prop="coinProxyKey">
          <el-input type="number" v-model="eidtCoinData.coinProxyKey" clearable></el-input>
        </el-form-item>

<!--        <el-form-item label="机构积分价值" prop="coinOrgKey">-->
<!--          <el-input type="number" v-model="eidtCoinData.coinOrgKey" clearable></el-input>-->
<!--        </el-form-item>-->
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <edita @getVaue="getValues" :baseValue="baseValue"/>
      <el-button type="primary" @click="submitEditCoin" :loading="submitLoading"
                 style="margin-top: 40px;margin-left: 90%">确认编辑
      </el-button>
    </el-card>

    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {
    updateCoinSingle,
    getCoinDetailById
  } from 'network/commandBank'

  import {quillEditor} from 'vue-quill-editor'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import show from '@/mixs/show'
  //导入封装好的富文本
  import Edita from 'views/Edita'
  export default {
    name: "EditCoin",
    mixins:[show],
    data() {
      return {
        eidtCoinData: {
          coinName: null,
          coinMsg: null,
          coinStart: null,
          coinCount: null,
          coinKey: null,
          coinProxyKey: null,
          // coinOrgKey: null,
          coinText: null
        },
        coinId: null,
        addEditDataRules: {
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
        isShowMain: true,

        contentEditor: '',
        baseValue:'',
        editorOption: {
          placeholder: '编辑兑换卷兑换步骤详情'
        }
      }
    },
    methods: {
      //获取
      async getCoinId() {
        this.coinId = this.$route.params.coinId

        try {
          let d = await getCoinDetailById(this.coinId)

          for (let key in d) {
            this.eidtCoinData[key] = d[key]
          }

          this.baseValue = d.coinText

          this.isShowMain = false

        } catch (e) {
          this.isShowMain = false
          this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      },

      //确认编辑

      submitEditCoin() {
        this.submitLoading = true
        this.$refs.editUserForm.validate(async r => {
          if (r) {
            let coinId = this.coinId
            let {
              coinName,
              coinMsg,
              coinStart,
              coinKey,
              coinCount,
              coinProxyKey,
            } = this.eidtCoinData
            try {
              let data = await updateCoinSingle({
                coinId,
                coinName,
                coinMsg,
                coinStart,
                coinKey,
                coinCount,
                coinProxyKey,
                coinOrgKey:coinProxyKey,
                coinText: this.contentEditor
              })
              if (data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '兑换卷更新成功！'
                })
                this.submitLoading = false

                this.$router.push('/home/commandCoin')

              } else {
                this.submitLoading = false
                this.$message({
                  type: 'success',
                  message: '兑换卷更新失败！'
                })
              }
            } catch (e) {
              this.submitLoading = false
              this.$message({
                type: 'error',
                message: '服务器响应错误！'
              })
            }
          } else {
            this.submitLoading = false
            this.$message({
              type: 'error',
              message: '请检查表单信息是否准确！'
            })
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