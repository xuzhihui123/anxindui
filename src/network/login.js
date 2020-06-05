/*
 * @Author: Lancer
 * @Date:2019/12/16
 * @Last Modified by:   Lancer
 * @Last Modified time: 2019/12/16
 */

import {request} from "network/request";
import Qs from "qs";


//用户登录
export function adminlogin(data) {
  return request({
    method:'post',
    url:'/admin/adminLogin',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers:{'Content-Type':'application/x-www-form-urlencoded'}

  })
}

//获取验证码

export function getIdenCode() {
  return request({
    method:'get',
    url:'/getCode'
  })
}

