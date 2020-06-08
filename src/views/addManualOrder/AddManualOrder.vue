<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/manualOrder' }">客服报单</el-breadcrumb-item>
      <el-breadcrumb-item>添加报单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="my-card" style="margin-top: 20px">
      <el-form :model="addBdData" status-icon ref="addBdForm"
               label-width="180px"
               :rules="addBdDataRules"
               class="demo-ruleForm"
               label-position="left">
        <el-form-item label="选择产品：" prop="itemId">

          <el-select v-model="addBdData.bankId" placeholder="请选择银行" v-loading="isLoadingOne" :disabled="isLoadingOne">
            <el-option :label="item.bankName" :value="item.bankId" v-for="item in bankList"
                       :key="item.bankId"></el-option>
          </el-select>

          <el-select v-model="addBdData.coinId" placeholder="请选择兑换卷" style="margin: 0 15px" v-show="isShowSelec">
            <el-option :label="item.coinName" :value="item.coinId" v-for="item in coinList"
                       :key="item.coinId"></el-option>
          </el-select>
          <el-select v-model="addBdData.itemId" placeholder="请选择产品" v-show="isShowSelec">
            <el-option :label="item.itemName" :value="item.itemId" v-for="item in itemList"
                       :key="item.itemId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名：" prop="orderUserName">
          <el-input v-model="addBdData.orderUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户电话号码：" prop="orderUserPhone">
          <el-input v-model="addBdData.orderUserPhone" autocomplete="off" type="number"></el-input>
        </el-form-item>


        <el-form-item label="兑换积分：" :prop="isOrderScore" v-if="isShowSdbd">
          <el-input v-model="addBdData.orderScore" autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="兑换金额：" :prop="isOrderFaceValue" v-if="isShowSdbd">
          <el-input v-model="addBdData.orderFaceValue" autocomplete="off" type="number"></el-input>
        </el-form-item>


        <el-form-item label="用户报单备注 (选填)" prop="orderMsg">
          <el-input v-model="addBdData.orderMsg" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="报单兑换码 (选填)" prop="orderKey">
          <el-input v-model="addBdData.orderKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员报单备注 (选填)" prop="orderCheckMsg">
          <el-input v-model="addBdData.orderCheckMsg" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="选择图片">
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="http://www.dui1688.com/imgUpload"
                  :multiple="false"
                  :on-exceed="handleExceed"
                  :on-remove="handleRemove"
                  :limit="1"
                  :on-change="changeFile"
                  :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="" v-show="isShowImg">
          <el-image :src="fileList.url" :preview-src-list="previewList" style="width:150px;">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </el-form-item>

        <el-form-item prop="orderCheckMsg">
          <el-button type="primary" @click="submitAddManualOrder" :loading="submitBdLoading">确认添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {fileToBase} from 'utils/fileToBase64'
  import {
    upLoadImg
  } from 'network/commandBank'
  import {getAllBankList, getBankInfoById} from 'network/commandBank'
  import {manualCommitOrder} from 'network/order'
  import getAdminUser from '@/mixs/getAdminUser'

  var that;
  export default {
    name: "AddManualOrder",
    mixins: [getAdminUser],
    data() {
      let validatePhone = (rule, value, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号！'))
        } else {
          callback()
        }
      }
      return {
        //添加报单的表单
        addBdData: {
          orderCheckMsg: '',
          bankId: '',
          bankName: '',
          coinId: '',
          itemId: '',
          orderUserName: '',
          orderUserPhone: '',
          orderKey: '',
          orderMsg: '',
          orderScore: '',
          orderFaceValue: '',
          orderImg: ''
        },
        //添加报单的loading
        submitBdLoading: false,

        //添加报单的表单规则
        addBdDataRules: {
          itemId: [
            {required: true, message: '请选择商品'}
          ],
          orderUserName: [
            {required: true, message: '请输入报单人姓名！'}
          ],
          orderScore: [
            {required: true, message: '请输入兑换积分！'}
          ],
          orderFaceValue: [
            {required: true, message: '请输入兑换金额！'}
          ],
          orderUserPhone: [
            {required: true, message: '请输入报单人电话号码!'},
            {validator: validatePhone, trigger: "change"}
          ]
        },

        bankList: [],
        coinList: [],
        itemList: [],
        isShowSelec: false,
        isLoadingOne: false,
        isShowSdbd: false,

        //是否检测orderScore
        isOrderScore: '1',
        //是否检测orderFaceValue
        isOrderFaceValue: '1',


        //上传图片
        fileList: {
          name: '',
          url: '',
          file: null
        },
        //是否显示图片
        isShowImg: false,
        //大图预览
        previewList: []
      }
    },
    methods: {
      //获取银行列表
      async getAllBankList() {
        that.isLoadingOne = true
        try {
          let d = await getAllBankList()
          this.bankList = d
          that.isLoadingOne = false
        } catch (e) {
          that.isLoadingOne = false
          return this.$message({
            type: 'error',
            message: '服务器响应失败'
          })
        }
      },


      //确认添加
      submitAddManualOrder() {
        this.submitBdLoading = true
        this.$refs.addBdForm.validate(async r => {
          // 如果校验成功
          if (r) {
            this.$message({
              type: 'success',
              message: "正在添加中~"
            })
            let {orderCheckMsg, itemId, orderUserName, orderUserPhone, orderKey, orderMsg, bankName, orderScore, orderFaceValue} = this.addBdData
            let adminPowerName
            if (this.adminPower === 1) {
              adminPowerName = '超级管理员'
            } else {
              adminPowerName = '普通管理员'
            }
            //提交报单
            let orderMsgT = `${orderCheckMsg}（${adminPowerName}:${this.adminName}）- 添加报单`

            if (itemId !== -1) {
              if (!this.fileList.file) {
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower
                })
                if (submitData.msg === '用户不存在') {
                  //关闭loading
                  this.submitBdLoading = false
                  return this.$message({
                    type: 'warning',
                    message: '请输入正确的用户姓名和手机号码!'
                  })
                }
                //关闭loading
                this.submitBdLoading = false
                this.$message({
                  type: 'success',
                  message: '添加报单成功!'
                })
                this.$router.go(-1)
              } else {
                //先上传图片
                let f = new FormData()
                f.append('file', this.fileList.file)
                let d = await upLoadImg(f)
                let fileSrc = d.data
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  orderImg:fileSrc
                })
                if (submitData.msg === '用户不存在') {
                  //关闭loading
                  this.submitBdLoading = false
                  return this.$message({
                    type: 'warning',
                    message: '请输入正确的用户姓名和手机号码!'
                  })
                }
                //关闭loading
                this.submitBdLoading = false
                this.$message({
                  type: 'success',
                  message: '添加报单成功!'
                })
                this.$router.go(-1)
              }
            } else {
              if(!this.fileList.file){
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  orderBankName: bankName,
                  orderScore,
                  orderFaceValue
                })

                if (submitData.msg === '用户不存在') {
                  //关闭loading
                  this.submitBdLoading = false
                  return this.$message({
                    type: 'warning',
                    message: '请输入正确的用户姓名和手机号码!'
                  })
                }
                //关闭loading
                this.submitBdLoading = false

                this.$message({
                  type: 'success',
                  message: '添加报单成功!'
                })

                this.$router.go(-1)
              }else{
                let f = new FormData()
                f.append('file', this.fileList.file)
                let d = await upLoadImg(f)
                let fileSrc = d.data
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  orderBankName: bankName,
                  orderScore,
                  orderFaceValue,
                  orderImg:fileSrc
                })
                if (submitData.msg === '用户不存在') {
                  //关闭loading
                  this.submitBdLoading = false
                  return this.$message({
                    type: 'warning',
                    message: '请输入正确的用户姓名和手机号码!'
                  })
                }
                //关闭loading
                this.submitBdLoading = false

                this.$message({
                  type: 'success',
                  message: '添加报单成功!'
                })

                this.$router.go(-1)
              }
            }

          } else {
            this.submitBdLoading = false
            this.$message({
              type: 'warning',
              message: "请检查表单信息是否完整正确！"
            })
          }
        })
      },


      handleExceed(files, fileList) {
        this.$message.warning(`只能选择一张图片哦~`);
      },


      changeFile(file, fileList) {
        let f = file
        let type = f.raw.type
        if (type && (type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg')) {
          this.fileList.file = f.raw
          //转换成base64
          fileToBase(f.raw).then(r => {
            this.fileList.name = f.raw.name
            this.fileList.url = r
            this.isShowImg = true
            this.previewList.push(this.fileList.url)
          })
        } else {
          this.$refs.upload.clearFiles()
          return this.$message({
            type: 'warning',
            message: '请上传指定类型图片！'
          })
        }
      },

      handleRemove(file, fileList) {
        this.fileList.file = null
        this.fileList.name = ''
        this.fileList.url = ''
        this.isShowImg = false
        this.previewList = []
      },
    },
    created() {
      that = this
      //获取银行列表所有信息
      this.getAllBankList()
    },
    watch: {
      'addBdData.bankId': {
        deep: true,
        handler: async (newV) => {
          that.addBdData.itemId = ''
          that.addBdData.coinId = ''
          that.isLoadingOne = true
          let d = await getBankInfoById({bankId: newV})
          that.addBdData.bankName = d.data.bankName
          if (d.data.bankCoinList.length === 0) {
            that.isLoadingOne = false
            that.isShowSelec = true
            that.coinList = [{coinName: '手动报单', coinId: -1}]
            that.itemList = [{itemName: '手动报单', itemId: -1}]
          } else {
            that.isLoadingOne = false
            that.isShowSelec = true
            that.coinList = [{coinName: '手动报单', coinId: -1}, ...d.data.bankCoinList]
          }
        }
      },
      'addBdData.coinId': {
        deep: true,
        handler: (newV) => {
          that.addBdData.itemId = ''
          if (newV === -1) {
            that.itemList = [{itemName: '手动报单', itemId: -1}]
          } else {
            that.coinList.forEach(item => {
              if (item.coinId === newV) {
                that.itemList = [...item.bankCoinItemList]
              }
            })
          }
        }
      },
      'addBdData.itemId': {
        deep: true,
        handler: function (newV) {
          if (newV === -1) {
            this.isShowSdbd = true
            //更改规则
            this.isOrderScore = 'orderScore'
            this.isOrderFaceValue = 'orderFaceValue'
          } else {
            this.isShowSdbd = false
            this.isOrderScore = '1'
            this.isOrderFaceValue = '1'
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>