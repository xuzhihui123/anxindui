/*
 * @Author: Lancer
 * @Date:2020/5/18
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/18
 */

import {request} from "network/request";
import Qs from "qs";


//根据用户id 获取提现记录  GET /order/getWithdrawalById

export function getWithdrawalById(withdrawalId) {
  return request({
    method: 'get',
    url: '/order/getWithdrawalById',
    params: {
      withdrawalId
    }
  })
}

//获取提现分页  GET /order/getWithdrawalListByPage

export function getWithdrawalListByPage(pageNum, pageSize) {
  return request({
    method: 'get',
    url: '/order/getWithdrawalListByPage',
    params: {
      pageNum,
      pageSize
    }
  })
}

//POST /order/checkWithdrawal  提现审核
export function checkWithdrawal(data) {
  return request({
    method: 'post',
    url: '/order/checkWithdrawal',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

// GET /order/selectW  模糊查询提现
export function selectW(params) {
  return request({
    method: 'get',
    url: '/order/selectW',
    params
  })
}


