/*
 * @Author: Lancer
 * @Date:2020/5/28
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/28
 */

import {request} from "network/request";
import Qs from "qs";


export function getIncomeListByRule(pageIndex, pageSize) {
  return request({
    url: '/income/getIncomeInfoByPage',
    method: 'get',
    params: {
      pageIndex,
      pageSize
    }
  })
}

export function selectIncomeInfo(params) {
  return request({
    url: '/income/selectIncomeInfo',
    method: 'get',
    params
  })
}