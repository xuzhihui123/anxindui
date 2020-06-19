<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/manualOrder' }">客服报单</el-breadcrumb-item>
      <el-breadcrumb-item>添加报单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="my-card" style="margin-top: 20px">
      <el-form
        :model="addBdData"
        status-icon
        ref="addBdForm"
        label-width="180px"
        :rules="addBdDataRules"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="选择产品：" prop="itemId">
          <el-select
            v-model="addBdData.bankId"
            placeholder="请选择银行"
            v-loading="isLoadingOne"
            :disabled="isLoadingOne"
          >
            <el-option
              :label="item.bankName"
              :value="item.bankId"
              v-for="item in bankList"
              :key="item.bankId"
            ></el-option>
          </el-select>

          <el-select
            v-model="addBdData.coinId"
            placeholder="请选择兑换卷"
            style="margin: 0 15px"
            v-show="isShowSelec"
          >
            <el-option
              :label="item.coinName"
              :value="item.coinId"
              v-for="item in coinList"
              :key="item.coinId"
            ></el-option>
          </el-select>
          <el-select v-model="addBdData.itemId" placeholder="请选择产品" v-show="isShowSelec">
            <el-option
              :label="item.itemName"
              :value="item.itemId"
              v-for="item in itemList"
              :key="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名：" prop="orderUserName">
          <el-input v-model="addBdData.orderUserName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="用户手机号码：" prop="orderUserPhone">
          <el-input
            v-model="addBdData.orderUserPhone"
            autocomplete="off"
            type="number"
            placeholder="请输入正确的手机号码！"
            v-loading="loadingUserPhone"
            :disabled="loadingUserPhone"
          ></el-input>
        </el-form-item>

        <!--        隐藏提示文字-->
        <el-form-item label prop="orderUserPhone" v-show="isShowTipText">
          <span class="tips_color">{{tipText}}</span>
        </el-form-item>

        <el-form-item label="报单手机号码：" prop="createOrderUserPhone">
          <el-input
            v-model="addBdData.createOrderUserPhone"
            autocomplete="off"
            type="number"
            placeholder="请输入正确的手机号码！"
          ></el-input>
        </el-form-item>

        <el-form-item label="兑换积分：" :prop="isOrderScore" v-if="isShowSdbd">
          <el-input
            v-model="addBdData.orderScore"
            autocomplete="off"
            type="number"
            placeholder="请输入兑换积分"
          ></el-input>
        </el-form-item>

        <el-form-item label="兑换金额：" v-if="false">
          <el-input
            :disabled="true"
            v-model="addBdData.orderFaceValue"
            autocomplete="off"
            type="number"
          ></el-input>
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
            :multiple="true"
            accept="image/jpeg, image/png, image/jpg"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label v-show="isShowImg">
          <el-image
            :src="item.url"
            :preview-src-list="previewList"
            style="width:150px;margin-left:20px"
            v-for="item in fileList"
            :key="item.uid"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
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
import { fileToBase } from "utils/fileToBase64";
import { upLoadImgs } from "network/commandBank";
import { getAllBankList, getBankInfoById } from "network/commandBank";
import { manualCommitOrder } from "network/order";
import getAdminUser from "@/mixs/getAdminUser";
import { getUserByPhone } from "network/users";

var that;
export default {
  name: "AddManualOrder",
  mixins: [getAdminUser],
  data() {
    let validatePhone = async (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        // callback(new Error(''))
        this.isShowTipText = false;
        this.tipText = "";
        this.timeUsers = {};
      } else {
        //手机号码验证通过 发送请求
        this.loadingUserPhone = true;
        let d = await getUserByPhone(value);
        if (d.code === 200) {
          this.timeUsers = d.data;
          this.isShowTipText = true;
          switch (this.timeUsers.userRole) {
            case "member":
              this.tipText = `你当前选择的用户是:${this.timeUsers.userBankUsername}（会员)！`;
              break;
            case "proxy":
              this.tipText = `你当前选择的用户是:${this.timeUsers.userBankUsername}（代理）！`;
              break;
            case "org":
              this.tipText = `你当前选择的用户是:${this.timeUsers.userBankUsername}(机构)！`;
              break;
          }
        } else {
          this.isShowTipText = true;
          this.tipText = "找不到当前用户！请重新输入正确的手机号码！";
          this.timeUsers = {};
        }
        this.loadingUserPhone = false;
        callback();
      }
    };

    let validatePhones = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号码！"));
      } else {
        callback();
      }
    };
    return {
      loadingUserPhone: false,
      //记录选择手机号码后的用户信息
      timeUsers: {},
      //记录选择后提示的文字
      tipText: "",
      //是否显示提示文字
      isShowTipText: false,
      //兑换卷比例
      proportNumber: {},
      //添加报单的表单
      addBdData: {
        orderCheckMsg: "",
        bankId: "",
        bankName: "",
        coinId: "",
        itemId: "",
        orderUserName: "",
        orderUserPhone: "",
        orderKey: "",
        orderMsg: "",
        orderScore: "",
        orderFaceValue: null,
        orderImg: "",
        createOrderUserPhone: ""
      },
      //添加报单的loading
      submitBdLoading: false,

      //添加报单的表单规则
      addBdDataRules: {
        itemId: [{ required: true, message: "请选择商品" }],
        orderUserName: [{ required: true, message: "请输入报单人姓名！" }],
        orderScore: [{ required: true, message: "请输入兑换积分！" }],
        orderUserPhone: [{ validator: validatePhone, trigger: "change" }],
        createOrderUserPhone: [{ validator: validatePhones, trigger: "change" }]
      },

      bankList: [],
      coinList: [],
      itemList: [],
      isShowSelec: false,
      isLoadingOne: false,
      isShowSdbd: false,

      //是否检测orderScore
      isOrderScore: "1",

      //上传图片
      fileList: [],
      //是否显示图片
      isShowImg: false,
      //大图预览
      previewList: []
    };
  },
  methods: {
    //获取银行列表
    async getAllBankList() {
      that.isLoadingOne = true;
      try {
        let d = await getAllBankList();
        this.bankList = d;
        that.isLoadingOne = false;
      } catch (e) {
        that.isLoadingOne = false;
        return this.$message({
          type: "error",
          message: "服务器响应失败"
        });
      }
    },

    //确认添加
    submitAddManualOrder() {
      this.submitBdLoading = true;
      this.$refs.addBdForm.validate(async r => {
        //没有输入正确的手机号的时候
        if (!this.timeUsers.userRole) {
          this.submitBdLoading = false;
          return this.$message({
            type: "warning",
            message: "输入的用户不存在！"
          });
        } else {
          // 如果校验成功
          if (r) {
            this.$message({
              type: "success",
              message: "正在添加中~"
            });
            let {
              orderCheckMsg,
              itemId,
              orderUserName,
              orderUserPhone,
              orderKey,
              orderMsg,
              bankName,
              orderScore,
              orderFaceValue,
              createOrderUserPhone
            } = this.addBdData;
            let adminPowerName;
            if (this.adminPower === 1) {
              adminPowerName = "超级管理员";
            } else {
              adminPowerName = "普通管理员";
            }
            //提交报单
            let orderMsgT = `${orderCheckMsg}（${adminPowerName}:${this.adminName}）- 添加报单`;

            if (itemId !== -1) {
              //不上传图片的 直接发送服务器
              if (this.fileList.length === 0) {
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  createOrderUserPhone
                });
                if (submitData.msg === "用户不存在") {
                  //关闭loading
                  this.submitBdLoading = false;
                  return this.$message({
                    type: "warning",
                    message: "请输入正确的用户姓名和手机号码!"
                  });
                }
                //关闭loading
                this.submitBdLoading = false;
                this.$message({
                  type: "success",
                  message: "添加报单成功!"
                });
                this.$router.go(-1);
              } else {
                //先上传图片
                let f = new FormData();
                this.fileList.forEach(item => {
                  f.append("file", item.file);
                });
                let d = await upLoadImgs(f);
                let fileSrc = "";
                d.data.forEach(item => {
                  fileSrc += item + ",";
                });
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  orderImg: fileSrc,
                  createOrderUserPhone
                });
                if (submitData.msg === "用户不存在") {
                  //关闭loading
                  this.submitBdLoading = false;
                  return this.$message({
                    type: "warning",
                    message: "请输入正确的用户姓名和手机号码!"
                  });
                }
                //关闭loading
                this.submitBdLoading = false;
                this.$message({
                  type: "success",
                  message: "添加报单成功!"
                });
                this.$router.go(-1);
              }
            } else {
              if (this.fileList.length === 0) {
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  orderBankName: bankName,
                  orderCoinName: this.proportNumber.coinName,
                  orderScore,
                  orderFaceValue,
                  createOrderUserPhone
                });

                if (submitData.msg === "用户不存在") {
                  //关闭loading
                  this.submitBdLoading = false;
                  return this.$message({
                    type: "warning",
                    message: "请输入正确的用户姓名和手机号码!"
                  });
                }
                //关闭loading
                this.submitBdLoading = false;

                this.$message({
                  type: "success",
                  message: "添加报单成功!"
                });

                this.$router.go(-1);
              } else {
                //先上传图片
                let f = new FormData();
                this.fileList.forEach(item => {
                  f.append("file", item.file);
                });
                let d = await upLoadImgs(f);
                let fileSrc = "";
                d.data.forEach(item => {
                  fileSrc += item + ",";
                });
                let submitData = await manualCommitOrder({
                  orderCheckMsg: orderMsgT,
                  orderItemId: itemId,
                  orderCoinName: this.proportNumber.coinName,
                  orderUserName,
                  orderUserPhone,
                  orderKey,
                  orderMsg,
                  orderAdminId: this.adminPower,
                  orderBankName: bankName,
                  orderScore,
                  orderFaceValue,
                  orderImg: fileSrc,
                  createOrderUserPhone
                });
                if (submitData.msg === "用户不存在") {
                  //关闭loading
                  this.submitBdLoading = false;
                  return this.$message({
                    type: "warning",
                    message: "请输入正确的用户姓名和手机号码!"
                  });
                }
                //关闭loading
                this.submitBdLoading = false;

                this.$message({
                  type: "success",
                  message: "添加报单成功!"
                });

                this.$router.go(-1);
              }
            }
          } else {
            this.submitBdLoading = false;
            this.$message({
              type: "warning",
              message: "请检查表单信息是否完整正确！"
            });
          }
        }
      });
    },

    changeFile(file, fileList) {
      let f = file;
      let type = f.raw.type;
      if (f.size / 1024 / 1024 > 10) {
        this.$message({
          type: "warning",
          message: "上传的图片大小不能超过10M！"
        });
        return false;
      }
      if (
        type &&
        (type === "image/jpeg" || type === "image/png" || type === "image/jpg")
      ) {
        //转换成base64
        fileToBase(f.raw).then(r => {
          this.isShowImg = true;
          this.fileList.push({
            name: f.raw.name,
            url: r,
            file: f.raw,
            uid: f.uid
          });
          this.previewList.push(r);
        });
      } else {
        return this.$message({
          type: "warning",
          message: "请上传指定类型图片！"
        });
      }
    },

    handleRemove(file, fileList) {
      this.fileList.forEach((item, i) => {
        if (item.uid === file.uid) {
          this.fileList.splice(i, 1);
          this.previewList.splice(i, 1);
        }
      });
    }
  },
  created() {
    that = this;
    //获取银行列表所有信息
    this.getAllBankList();
  },
  watch: {
    "addBdData.bankId": {
      deep: true,
      handler: async newV => {
        that.addBdData.itemId = "";
        that.addBdData.coinId = "";
        that.isLoadingOne = true;
        let d = await getBankInfoById({ bankId: newV });
        that.addBdData.bankName = d.data.bankName;
        if (d.data.bankCoinList.length === 0) {
          that.isLoadingOne = false;
          that.isShowSelec = false;
        } else {
          that.isLoadingOne = false;
          that.isShowSelec = true;
          that.coinList = [...d.data.bankCoinList];
        }
      }
    },
    "addBdData.coinId": {
      deep: true,
      handler: newV => {
        that.addBdData.itemId = "";
        that.coinList.forEach(item => {
          if (item.coinId === newV) {
            that.proportNumber = item;
            that.itemList = [
              { itemName: "手动报单", itemId: -1 },
              ...item.bankCoinItemList
            ];
          }
        });
      }
    },
    "addBdData.itemId": {
      deep: true,
      handler: function(newV) {
        if (newV === -1) {
          this.isShowSdbd = true;
          //更改规则
          this.isOrderScore = "orderScore";
        } else {
          this.isShowSdbd = false;
          this.isOrderScore = "1";
        }
      }
    },
    "addBdData.orderUserPhone": {
      deep: true,
      handler: function(newV) {
        if (!newV) {
          this.timeUsers = {};
          this.tipText = "";
          this.isShowTipText = false;
        }
      }
    },
    "addBdData.orderScore": {
      deep: true,
      handler: function(newV) {
        let userRol = this.timeUsers.userRole;
        let number;
        switch (userRol) {
          case "member":
            number = this.proportNumber.coinKey;
            break;
          case "proxy":
            number = this.proportNumber.coinProxyKey;
            break;
          case "org":
            number = this.proportNumber.coinOrgKey;
            break;
        }
        this.addBdData.orderFaceValue =
          Number(((parseInt(newV) / 10000) * number).toFixed(2)) || null;
      }
    },
    timeUsers: {
      deep: true,
      handler: function(newV) {
        if (!newV.userRole) {
          //如果没有用户 就把金额改为null
          this.addBdData.orderFaceValue = null;
        } else {
          let userRol = newV.userRole;
          let number;
          switch (userRol) {
            case "member":
              number = this.proportNumber.coinKey;
              break;
            case "proxy":
              number = this.proportNumber.coinProxyKey;
              break;
            case "org":
              number = this.proportNumber.coinOrgKey;
              break;
          }
          this.addBdData.orderFaceValue =
            Number(
              ((parseInt(this.addBdData.orderScore) / 10000) * number).toFixed(
                2
              )
            ) || null;
        }
      }
    },
    //监听图片展示
    fileList: {
      deep: true,
      handler: function(newV) {
        if (newV.length === 0) {
          this.isShowImg = false;
        } else {
          this.isShowImg = true;
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .el-input.is-disabled .el-input__inner {
  color: #2196f3;
}

.tips_color {
  color: #f44336;
}
</style>