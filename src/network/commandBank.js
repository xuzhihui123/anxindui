/*
 * @Author: Lancer
 * @Date:2020/5/12
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/12
 */

import {request} from "network/request";
import Qs from "qs";


//获取所有银行列表
export function getAllBankList() {
  return request({
    url: "/bank/getBankList"
  })
}

//获取银行列表分页
export function getAllBankListRule(pageNum, pageSize) {
  return request({
    url: '/bank/getBankListByPge',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}


//根据id删除银行
export function removeBankById(bankId) {
  return request({
    url: '/bank/removeBank',
    method: 'post',
    data: {
      bankId
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}


//根据id编辑 第一层银行信息
export function editBank(data) {
  return request({
    url: '/bank/updateBank',
    method: 'post',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}


//根据id获取银行信息
export function getBankInfoById({bankId}) {
  return request({
    url: '/bank/getBankById',
    method: 'get',
    params: {
      bankId
    },
  })
}


//添加银行
export function addSingleBank({bankName, bankQueryMsg, bankIcon}) {
  return request({
    url: '/bank/addBank',
    method: 'post',
    data: {
      bankName,
      bankQueryMsg,
      bankIcon
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}


//根据银行id 获取兑换卷信息GET /bank/getCoinByBankId
export function getCoinByBankId(bankId) {
  return request({
    url: '/bank/getCoinByBankId',
    method: 'get',
    params: {
      bankId
    },
  })
}

//根据银行 id 获取 兑换卷分页 GET /bank/getCoinByBankIdByPage

export function getCoinByBankIdByPage(bankId, pageNum, pageSize) {
  return request({
    url: '/bank/getCoinByBankIdByPage',
    method: 'get',
    params: {
      bankId,
      pageNum,
      pageSize
    },
  })
}


//根据兑换卷id 更新兑换卷 GET /bank/updateCoin
export function updateCoinSingle(data) {
  return request({
    url: '/bank/updateCoin',
    method: 'post',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

//根据兑换卷id 获取兑换卷信息GET /bank/getCoinById
export function getCoinDetailById(coinId) {
  return request({
    url: '/bank/getCoinById',
    method: 'get',
    params: {
      coinId
    },
  })
}


//根据id 删除兑换卷GET /bank/removeCoin
export function removeSingleCoin(coinId) {
  return request({
    url: '/bank/removeCoin',
    method: 'get',
    params: {
      coinId
    },
  })
}

//添加兑换卷  需要传银行id GET /bank/addCoin
export function addSingleCoin(params) {
  return request({
    url: '/bank/addCoin',
    method: 'get',
    params
  })
}

//添加商品 GET /GET /bank/addItem
export function addSingleItem({itemScore, itemName, itemTime, itemPrice, itemProxyPrice, itemOrgPrice, itemCoinId}) {
  return request({
    url: '/bank/addItem',
    method: 'get',
    params: {
      itemScore, itemName, itemTime, itemPrice, itemProxyPrice, itemOrgPrice, itemCoinId
    }
  })
}


//根据id删除产品GET /bank/removeItem
export function removeProSingle(itemId) {
  return request({
    url: '/bank/removeItem',
    method: 'get',
    params:{
      itemId
    }
  })
}

//根据id  更新产品  GET /bank/updateItem
export function updateSingleItem({itemScore, itemName, itemTime, itemPrice, itemProxyPrice, itemOrgPrice, itemId}) {
  return request({
    url: '/bank/updateItem',
    method: 'get',
    params: {
      itemScore, itemName, itemTime, itemPrice, itemProxyPrice, itemOrgPrice, itemId
    }
  })
}

//根据产品id 获取产品详情 GET /bank/getItemById
export function getItemDetailById(itemId) {
  return request({
    url: '/bank/getItemById',
    method: 'get',
    params:{
      itemId
    }
  })
}


//根据兑换卷id获取商品信息
export function getProductsListByCoinId(coinId) {
  return request({
    url: '/bank/getItemsByCoinId',
    method: 'get',
    params:{
      coinId
    }
  })
}


//根据兑换卷id获取商品分页 GET /bank/getItemByCoinIdByPage
export function getItemByCoinIdByPage(pageNum,pageSize,coinId) {
  return request({
    url: '/bank/getItemByCoinIdByPage',
    method: 'get',
    params:{
      pageNum,
      pageSize,
      coinId
    }
  })
}


//上传图片接口
export function upLoadImg(data) {
  return request({
    method: 'post',
    url: '/imgUpload',
    data,
    headers: {"Content-Type": "multipart/form-data"}
  })
}

//上传多张图片接口
export function upLoadImgs(data) {
  return request({
    method: 'post',
    url: '/imgsUpload',
    data,
    headers: {"Content-Type": "multipart/form-data"}
  })
}