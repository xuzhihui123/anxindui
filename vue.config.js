/*
 * @Author: Lancer
 * @Date:2019/12/11
 * @Last Modified by:   Lancer
 * @Last Modified time: 2019/12/11
 */

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "commonjs": "@/commonjs",
        "components": "@/components",
        "common":"components/common",
        "content":"components/content",
        "network": "@/network",
        "views": "@/views",
        "utils":'@/utils'
      }
    }
  }
}