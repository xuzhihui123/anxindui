/*
 * @Author: Lancer
 * @Date:2020/5/18
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/18
 */

import {request} from "network/request";
import Qs from "qs";


//获取报单分页列表GET /order/getOrderListByPage
export function getOrderList(pageNum, pageSize) {
  return request(
      {
        method: 'get',
        url: '/order/getOrderListByPage',
        params: {
          pageNum,
          pageSize
        }
      }
  )
}


//根据id获取报单信息 GET /order/getOrderById
export function getOrderById(orderId) {
  return request(
      {
        method: 'get',
        url: '/order/getOrderById',
        params: {
          orderId
        }
      }
  )
}

//删除报单  GET /order/removeOrder
export function removeOrder(orderId) {
  return request(
      {
        method: 'get',
        url: '/order/removeOrder',
        params: {
          orderId
        }
      }
  )
}

//更新报单  GET /order/updateOrder
export function updateOrder(params) {
  return request(
      {
        method: 'get',
        url: '/order/updateOrder',
        params
      }
  )
}


//根据id审核报单 GET /order/checkOrder
export function checkOrder({orderId, orderCode, checkMsg}) {
  return request(
      {
        method: 'get',
        url: '/order/checkOrder',
        params: {
          orderId,
          orderCode,
          checkMsg
        }
      }
  )
}

//模糊条件查询报单
export function selectOrderByRole(params) {
  return request(
      {
        method: 'get',
        url: '/order/selectOrder',
        params
      }
  )
}

//手动提交报单
export function manualCommitOrder(params) {
  return request(
      {
        method: 'get',
        url: '/order/manualCommitOrder',
        params
      }
  )
}

//获取商品列表
export function getItemList() {
  return request(
      {
        method: 'get',
        url: '/bank/getItemList',
      }
  )
}


export function getAdminOrderByOwn(params) {
  return request(
      {
        method: 'get',
        url: '/order/getAdminOrderByOwn',
        params
      }
  )
}