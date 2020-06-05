/*
 * @Author: Lancer
 * @Date:2019/12/14
 * @Last Modified by:   Lancer
 * @Last Modified time: 2019/12/14
 */

import {request} from "network/request";
import Qs from 'qs'

//获取所有管理员
export function getAllSuperUsers(token) {
  return request(
      {
        method: 'post',
        url: '/admin/getAdminList',
      },token
  )
}

//根据分页和每页条数来获取管理员
export function getRuleSuperUsers(pageNum,pageSize,token) {
  return request({
    method:'post',
    url:'/admin/getAdminListByPage',
    params:{
      pageNum,
      pageSize
    }
  },token)
}

//删除管理员
export function deleteAdminUsersById(adminId, token) {
  return request(
      {
        method: 'post',
        url: '/admin/removeAdmin',
        data: {
          adminId
        },
        transformRequest: [function (data) {
          data = Qs.stringify(data);
          return data;
        }],
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      },
      token
  )
}

//添加管理员
export function addAdminUser({adminName, adminAccount, adminPassword}, token) {
  return request({
    method: 'post',
    url: '/admin/addAdmin',
    data: {
      adminName,
      adminAccount,
      adminPassword
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }, token)
}


//超级管理员编辑管理员
export function editAdminUser(data, token) {
  return request({
    method: 'post',
    url: '/admin/updateAdminBySuperAdmin',
    data,
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }, token)
}


//根据id获取管理员信息
export function getSingleAdminById(adminId) {
  return request({
    method: 'get',
    url: '/admin/getAdminById',
    params: {
      adminId
    }
  })
}


//管理员修改密码
export function normalChangeAdminPsd({adminId,adminPassword,oldPassword}) {
  return request({
    method: 'post',
    url: '/admin/updateAdminPassword',
    data:{
      adminId,
      adminPassword,
      oldPassword
    },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}