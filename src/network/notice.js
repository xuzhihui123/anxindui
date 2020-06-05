/*
 * @Author: Lancer
 * @Date:2020/6/1
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/6/1
 */

import {request} from "network/request";
import Qs from "qs";


//获取公告列表分页  GET /notice/getNoticeListByPage
export function getNoticeListByPage(params) {
  return request({
    method: 'get',
    url: '/notice/getNoticeListByPage',
    params
  })
}


//根据 id删除 公告GET /notice/removeNoticeById

export function removeNoticeById(id) {
  return request({
    method: 'get',
    url: '/notice/removeNoticeById',
    params: {
      id
    }
  })
}


//GET /notice/saveNoticeById  添加公告
export function saveNoticeById(data) {
  return request({
    method: 'post',
    url: '/notice/saveNoticeById',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}


//GET /notice/getNoticeById  根据id获取公告
export function getNoticeById(id) {
  return request({
    method: 'get',
    url: '/notice/getNoticeById',
    params: {
      id
    }
  })
}

// POST /notice/updateNoticeById  根据id修改公告
export function updateNoticeById(data) {
  return request({
    method: 'post',
    url: '/notice/updateNoticeById',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}