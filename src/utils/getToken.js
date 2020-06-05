/*
 * @Author: Lancer
 * @Date:2020/5/12
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/5/12
 */

import {request} from "network/request";

export function getToken(token) {
  return request(
      {
        method: "get",
        url: '/checkToken',
        params: {
          token
        }
      }
  )
}


//判断是否有token
export function isToken() {
    return localStorage.getItem('token')
}