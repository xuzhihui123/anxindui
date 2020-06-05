<template>
  <div class="login" style="min-width: 1200px">
    <div class="login-title">
      <img src="~assets/logoT.png" alt="" style="width: 100px;">
      安心兑后台管理系统
    </div>
    <div class="login-inner">
      <el-form :model="loginForm" status-icon ref="ruleForm" label-width="0px" class="demo-ruleForm"
               label-position="left">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" autocomplete="off" clearable="" prefix-icon="el-icon-user"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" autocomplete="off" clearable="" prefix-icon="el-icon-lock"
                    placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <!--        <el-form-item prop="idenCode">-->
        <!--          <el-input v-model="loginForm.idenCode" autocomplete="off" clearable="" prefix-icon="el-icon-edit-outline"-->
        <!--                    placeholder="请输入验证码"></el-input>-->
        <!--          <img :src="this.idenCodeData.idenCodeImg" alt="" class="idenCode-inner_img" @click="getCode">-->
        <!--        </el-form-item>-->
        <el-form-item label-width="0">
          <div class="submit" @click="loginSubmit" v-loading="submitLoading">登&nbsp;录</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {adminlogin, getIdenCode} from "network/login";
  import {Base64} from 'js-base64'

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          userName: "",
          passWord: "",
          idenCode: ""
        },
        idenCodeData: {
          idenCodeValue: "",
          idenCodeImg: "",
        },
        submitLoading: false
      };
    },
    methods: {
      //登录点击
      async loginSubmit() {
        this.submitLoading = true
        if (this.loginForm.userName.length === 0 || this.loginForm.passWord.length === 0) {
          this.submitLoading = false
          return this.$message({
            type: 'error',
            message: '请输入完整！',
            duration: 2000
          })
        }

        try {
          let d = await adminlogin({adminAccount: this.loginForm.userName, adminPassword: this.loginForm.passWord})
          if (d.code === 500) {
            this.submitLoading = false
            return this.$message({
              type: 'error',
              message: '用户名或密码错误',
              duration: 2000
            })
          }
          //登录成功保存Token
          let token = d.data[0]
          //保存用户名 和  姓名
          let {adminAccount, adminName, adminId} = d.data[1]
          localStorage.setItem('token', token)
          localStorage.setItem('adminAcc', Base64.encode(adminAccount))
          localStorage.setItem('adminNam', Base64.encode(adminName))
          localStorage.setItem('power', Base64.encode(adminId + 'lancer'))
          this.$message({
            type: 'success',
            message: "登录成功！"
          })
          this.submitLoading = false
          this.$router.push('/')
        } catch (error) {
          this.$message({
            type: 'error',
            message: '服务器响应错误',
            duration: 2000
          })
          this.submitLoading = false
        }

      },
    },
    created() {
      document.onkeydown = (e) => {
        if (e.keyCode === 13) {
          this.loginSubmit()
        }
      }
    },
    destroyed() {
      document.onkeydown = null
    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-input__inner {
    border: 1px solid #1cb1f5;
  }

  /deep/ .el-form-item__label {
    color: #666;
  }

  /deep/ .el-input__icon {
    color: #666;
    font-size: 18px;
  }

  /deep/ .el-form-item__content {
    display: flex;
  }

  .login {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(135deg, #3C8CE7 10%, #00EAFF 100%);

    .login-inner {
      width: 500px;
      margin: 0 auto;
      background-color: #fff;
      padding: 30px;
      padding-bottom: 20px;
      border-radius: 10px;
    }

    .login-title {
      width: 100%;
      text-align: center;
      margin: 0 auto;
      margin-top: 180px;
      margin-bottom: 30px;
      font-size: 32px;
      color: #fff;
    }
  }

  .idenCode-inner_img {
    height: 40px;
    margin-left: 20px;
  }

  .submit {
    width: 100%;
    text-align: center;
    background-image: linear-gradient(135deg, #3C8CE7 10%, #00EAFF 100%);
    border: 0;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    transition: all .1s;
    cursor: pointer;
  }
</style>