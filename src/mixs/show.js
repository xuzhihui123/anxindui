/*
 * @Author: Lancer
 * @Date:2020/5/22
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/22
 */


import {Base64} from "js-base64";
import NotFound from 'views/404'

const show = {
  data(){
    return {
      adminPower: null,
    }
  },
  methods: {
    //获取管理员权限
    getPowerByAdmin() {
      let power = Base64.decode(localStorage.getItem('power'))
      this.adminPower = parseInt(power.replace(/lancer/g, ''))
    },
  },
  created() {
    this.getPowerByAdmin()

    if (this.adminPower !== 1) {
      this.$message({
        type: 'error',
        message: '抱歉！您没有权限访问！'
      })
    }
  },
  components:{
    NotFound
  }
}

export default show