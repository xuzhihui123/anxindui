/*
 * @Author: Lancer
 * @Date:2020/1/19
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/1/19
 */
import { request } from "network/request";
import Qs from "qs";


//获取用户分页  POST /user/getUserListByPage

export function getUserListByPage(pageNum,pageSize) {
  return request({
    method: "post",
    url: "/user/getUserListByPage",
    data:{
      pageNum,
      pageSize
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
}


//冻结用户  POST /user/freezeUser
export function freezeUser(userId) {
  return request({
    method: "post",
    url: "/user/freezeUser",
    data:{
      userId
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
}

//解冻用户  POST /user/unFreezeUser
export function unFreezeUser(userId) {
  return request({
    method: "post",
    url: "/user/unFreezeUser",
    data:{
      userId
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
}


//搜索分页 GET /user/selectUserByBlur

export function selectUserByBlur(params) {
  return request({
    method: "get",
    url: "/user/selectUserByBlur",
    params
  });
}
