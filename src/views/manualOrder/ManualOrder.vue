<template>
  <div>
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/manualOrder' }">客服报单</el-breadcrumb-item>
      <el-breadcrumb-item>客服报单</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="goAddManualOrder">添加报单</el-button>
    </div>

    <!--        表格开始-->
    <el-card class="my-card" style="margin-top: 20px" v-loading="tableisLoading">
      <el-table
              :data="orderListData"
              border
              stripe
              style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="用户姓名：">
                <span>{{ props.row.userInfo.userBankUsername }}</span>
              </el-form-item>
              <el-form-item label="手机号码：">
                <span>{{ props.row.orderUserPhone }}</span>
              </el-form-item>
              <el-form-item label="报单时间：">
                <span>{{ props.row.orderCreateTime }}</span>
              </el-form-item>
              <el-form-item label="报单银行：">
                <span>{{ props.row.orderBankName }}</span>
              </el-form-item>
              <el-form-item label="兑换卷：">
                <span>{{ props.row.orderCoinName }}</span>
              </el-form-item>
              <el-form-item label="兑换产品：">
                <span>{{ props.row.orderItem }}</span>
              </el-form-item>
              <el-form-item label="产品价格：">
                <span>{{ props.row.orderFaceValue }}</span>
              </el-form-item>
              <el-form-item label="兑换积分：">
                <span>{{ props.row.orderScore }}</span>
              </el-form-item>

              <el-form-item label="兑换码：">
                <span>{{ props.row.orderKey || '无' }}</span>
              </el-form-item>

              <el-form-item label="上传图片：">
                <el-image :src="items" style="width: 150px;margin-left: 15px;" :preview-src-list="bigImgList" v-for="items in props.row.orderImg" :key="items">
                  <div slot="error" class="image-slot">
                    暂无图片
                  </div>
                </el-image>
              </el-form-item>

              <el-form-item label="兑换备注：">
                <span>{{ props.row.orderMsg || '无'}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
                label="用户姓名"
        >
          <template slot-scope="scope">
            {{scope.row.userInfo.userBankUsername}}
          </template>
        </el-table-column>

        <el-table-column
                label="手机号码"
        >
          <template slot-scope="scope">
            {{scope.row.orderUserPhone}}
          </template>
        </el-table-column>


        <el-table-column
                label="报单创建时间"
                width="180"
        >

          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.orderCreateTime}}</span>
          </template>
        </el-table-column>


        <el-table-column
                label="报单银行"
                align="center"
        >
          <template slot-scope="scope">
            {{scope.row.orderBankName}}
          </template>
        </el-table-column>

        <el-table-column
                label="报单积分"
                align="center"
        >
          <template slot-scope="scope">
            {{scope.row.orderScore}}
          </template>
        </el-table-column>

        <el-table-column
                label="审核状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.orderStatus === '审核通过' ? 'success' : 'danger'">{{scope.row.orderStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                prop="orderCheckMsg"
                label="管理员报单备注"
                width="200px"
        >
        </el-table-column>
      </el-table>

      <!--    分页-->
      <el-pagination
              style="margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="manualOrderPage.pageNum"
              :page-sizes="[5,10,15]"
              :page-size="manualOrderPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataLength">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
  import {getAdminOrderByOwn} from 'network/order'
  import getAdminUser from '@/mixs/getAdminUser'

  export default {
    name: "ManualOrder",
    mixins: [getAdminUser],
    data() {
      return {
        tableisLoading: false,
        //表格数据
        orderListData: [],

        //分页
        manualOrderPage: {
          pageNum: 1,
          pageSize: 5
        },
        tableDataLength: null,
        //大图显示
        bigImgList: []
      }
    },
    methods: {

      //获取客服自己的报单分页列表
      async getAdminOrderByOwn() {
        this.tableisLoading = true
        let {pageNum, pageSize} = this.manualOrderPage
        try {
          let d = await getAdminOrderByOwn({
            adminId: this.adminPower,
            pageNum,
            pageSize
          })
          let [data, count] = d.data
          data.forEach(item=>{
            item.orderImg = item.orderImg.split(',')
            item.orderImg = item.orderImg.slice(0,item.orderImg.length-1)
          })
          this.orderListData = data
          this.orderListData.forEach((item) => {
            item.orderImg.forEach(items=>{
              this.bigImgList.push(items)
            })
          })
          this.tableDataLength = count
          this.tableisLoading = false
        } catch (e) {
          this.tableisLoading = false
          return this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      },


      //分页操作
      //更改当前页
      handleCurrentChange(val) {
        this.manualOrderPage.pageNum = val;
        this.getAdminOrderByOwn()
      },
      //更改每页条数
      handleSizeChange(val) {
        this.manualOrderPage.pageSize = val;
        this.getAdminOrderByOwn()
      },

      //添加报单
      goAddManualOrder() {
        this.$router.push(`/home/addManualOrder`)
      }
    },
    created() {
      this.getAdminOrderByOwn()
    }
  }
</script>

<style scoped lang="less">

</style>