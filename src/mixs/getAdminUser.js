/*
 * @Author: Lancer
 * @Date:2020/5/29
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/29
 */


import {Base64} from "js-base64";

const getAdminUser =  {
  data(){
    return {
      adminPower: null,
      adminName: null,
    }
  },
  methods:{
    //获取 审核管理员信息
    getAdminInfo() {
      this.adminPower = parseInt(Base64.decode(localStorage.getItem('power')).replace('lancer', ''))
      if (localStorage.getItem('adminNam')) {
        this.adminName = Base64.decode(localStorage.getItem('adminNam'))
      } else {
        this.adminName = ''
      }
    },
  },
  created() {
    this.getAdminInfo()
  },
}

export default getAdminUser