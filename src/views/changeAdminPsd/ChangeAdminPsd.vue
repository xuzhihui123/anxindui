<template>
  <div>
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>更改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 20px;width: 40%">
      <el-form :model="changePsd" status-icon ref="changePsd"
               label-width="100px" class="demo-ruleForm" :rules="changePsdRules">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="text" v-model="changePsd.oldPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="adminPassword">
          <el-input type="text" v-model="changePsd.adminPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="adminPasswordAgain">
          <el-input type="text" v-model="changePsd.adminPasswordAgain" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitChange">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

  import {normalChangeAdminPsd} from 'network/super_users'
  import {Base64} from 'js-base64'

  export default {
    name: "ChangeAdminPsd",
    data() {
      //添加密码  输入框校验
      let validatePassWord = (rule, value, callback) => {
        if (!/^[a-zA-Z0-9_-]{3,11}$/.test(value)) {
          callback(new Error("密码必须是字母，数字，下划线组成！"));
        } else {
          callback();
        }
      };
      //添加再次输入密码  输入框校验
      let validatePassWordAgain = (rule, value, callback) => {
        if (value !== this.changePsd.adminPassword) {
          callback(new Error("两次输入密码不一样"));
        } else {
          callback();
        }
      };
      return {
        changePsd: {
          oldPassword: '',
          adminPassword: '',
          adminId: '',
          adminPasswordAgain: ''
        },
        changePsdRules: {
          oldPassword: [
            {required: true, trigger: "change", message: "请输入原密码"},
          ],
          adminPassword: [
            {required: true, trigger: "change", message: "请输入密码"},
            {validator: validatePassWord, trigger: "change"}
          ],
          adminPasswordAgain: [
            {required: true, trigger: "change", message: "请确认密码"},
            {validator: validatePassWordAgain, trigger: "change"}
          ]
        }
      }
    },
    methods: {
      //获取id
      getAdminId() {
        if (localStorage.getItem('power')) {
          this.changePsd.adminId = Number(Base64.decode(localStorage.getItem('power') + 'lancer').substring(0, 1))
        } else {
          this.$router.push('/login')
        }
      },
      submitChange() {
        this.$refs.changePsd.validate(async r => {
          if (r) {
              try{
                let {oldPassword, adminPassword, adminId} = this.changePsd
                let d = await normalChangeAdminPsd({oldPassword, adminPassword, adminId})
                if (d.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '更新成功！'
                  })
                  for (let key in this.changePsd) {
                    this.changePsd[key] = ''
                  }
                }else{
                  this.$message({
                    type: 'error',
                    message: '更新失败！请检查原密码是否错误！'
                  })
                }
              }catch(e){
                this.$message({
                  type: 'error',
                  message: '服务器错误！'
                })
              }
          } else {
            this.$message({
              type: 'warning',
              success: '请确认表单信息！'
            })
          }
        })

      }
    },
    created() {
      this.getAdminId()
    }
  }
</script>

<style scoped lang="less">

</style>