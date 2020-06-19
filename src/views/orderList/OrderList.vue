<template>
  <div>
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报单记录表</el-breadcrumb-item>
      <el-breadcrumb-item>报单记录表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--       头部搜索-->
    <el-form
      :inline="true"
      :model="searchIncomeSele"
      class="demo-form-inline"
      style="margin-top: 20px"
    >
      <el-form-item style="width:150px">
        <el-input v-model="searchIncomeSele.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="searchIncomeSele.phone" placeholder="请输入手机号码" type="number"></el-input>
      </el-form-item>
      <el-form-item style="width:150px">
        <el-select v-model="searchIncomeSele.orderStatus" placeholder="请选择审核状态">
          <el-option label="审核通过" value="审核通过"></el-option>
          <el-option label="审核不通过" value="审核不通过"></el-option>
          <el-option label="未审核" value="未审核"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchIncomeSele.orderType" placeholder="请选择报单类型" style="width:150px">
          <el-option label="客服报单" value="service"></el-option>
          <el-option label="用户报单" value="client"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchIncomeSele.time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          align="left"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="sumitSearchOrderList">确认</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goBackSearch">返回</el-button>
      </el-form-item>
    </el-form>

    <!--        表格开始-->
    <el-card class="my-card" style="margin-top: 20px" v-loading="tableisLoading">
      <el-table :data="orderListData" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="用户姓名：">
                <span>{{ props.row.userInfo.userBankUsername }}</span>
              </el-form-item>
              <el-form-item label="手机号码：">
                <span>{{ props.row.userInfo.userPhone }}</span>
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
                <el-image
                  :src="items"
                  style="width: 150px;margin-right: 15px;"
                  :preview-src-list="bigSrcList"
                  v-for="items in props.row.orderImg"
                  :key="items"
                >
                  <div slot="error" class="image-slot">暂无图片</div>
                </el-image>
              </el-form-item>

              <el-form-item label="兑换备注：">
                <span>{{ props.row.orderMsg || '无'}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="用户姓名">
          <template slot-scope="scope">{{scope.row.userInfo.userBankUsername}}</template>
        </el-table-column>

        <el-table-column label="手机号码">
          <template slot-scope="scope">{{scope.row.userInfo.userPhone}}</template>
        </el-table-column>

        <el-table-column label="报单创建时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.orderCreateTime}}</span>
          </template>
        </el-table-column>

        <el-table-column label="报单银行" align="center">
          <template slot-scope="scope">{{scope.row.orderBankName}}</template>
        </el-table-column>

        <el-table-column label="报单积分" align="center">
          <template slot-scope="scope">{{scope.row.orderScore}}</template>
        </el-table-column>

        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.orderStatus === '审核通过' ? 'success' : 'danger'"
            >{{scope.row.orderStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderCheckMsg" label="管理员备注" align="center" width="200px"></el-table-column>
        <el-table-column v-if="adminPower===1" label="操作" fixed="right" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.orderStatus=== '审核通过' ||scope.row.orderStatus=== '审核不通过' "
              type="success"
              @click="editOrder(scope.row['orderId'])"
            >
              <i class="el-icon-edit"></i>审核
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteOrder(scope.row['orderId'])"
              :disabled="scope.row.orderStatus=== '审核通过'"
            >
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--    分页-->
      <el-pagination
        v-show="!searchPageShow"
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderListPage.pageNum"
        :page-sizes="[5,10,15]"
        :page-size="orderListPage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataLength"
      ></el-pagination>

      <!--      模糊条件查询出来的分页-->
      <el-pagination
        v-show="searchPageShow"
        style="margin-top: 20px"
        @size-change="handleSizeChanges"
        @current-change="handleCurrentChanges"
        :current-page="orderListPages.pageNum"
        :page-sizes="[5,10,15]"
        :page-size="orderListPages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableDataLengths"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getOrderList, removeOrder, selectOrderByRole } from "network/order";
import { Base64 } from "js-base64";
import getAdminUser from "@/mixs/getAdminUser";
export default {
  name: "OrderList",
  mixins: [getAdminUser],
  data() {
    return {
      //大图预览
      bigSrcList: [],
      //表格加载
      tableisLoading: true,
      orderListData: [],
      orderListPage: {
        pageNum: 1,
        pageSize: 5
      },
      tableDataLength: null,

      orderListPages: {
        pageNum: 1,
        pageSize: 5
      },
      tableDataLengths: null,

      //查询条件
      searchIncomeSele: {
        orderStatus: "",
        time: null,
        userName: "",
        phone: "",
        orderType: ""
      },
      //查询条件分页
      searchPageShow: false,

      //商品列表
      itemListByGet: []
    };
  },
  methods: {
    //获取报单分页
    async getOrderList() {
      this.tableisLoading = true;
      try {
        let d = await getOrderList(
          this.orderListPage.pageNum,
          this.orderListPage.pageSize
        );
        if (d.status === 200) {
          this.tableisLoading = false;

          d.data[0].forEach(item => {
            item.orderImg = item.orderImg.split(",");
            item.orderImg = item.orderImg.slice(0, item.orderImg.length - 1);
          });
          this.orderListData = d.data[0];
          this.orderListData.forEach(item => {
            item.orderImg.forEach(items => {
              this.bigSrcList.push(items);
            });
          });
          this.tableDataLength = d.data[1];
        } else {
          this.tableisLoading = false;
          this.$message({
            type: "error",
            message: "获取报单信息失败！"
          });
        }
      } catch (e) {
        this.tableisLoading = false;
        this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    },

    //编辑
    editOrder(orderId) {
      this.$router.push(`/home/editOrderList/${orderId}`);
    },

    //删除
    deleteOrder(orderId) {
      this.$confirm("确定删除该报单信息吗", "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let d = await removeOrder(orderId);
            if (d.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
            }
            this.tableisLoading = true;
            this.getOrderList();
          } catch (e) {
            this.$message({
              type: "error",
              message: "服务器错误！"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //分页操作
    //更改当前页
    handleCurrentChange(val) {
      this.orderListPage.pageNum = val;
      this.getOrderList();
    },
    //更改每页条数
    handleSizeChange(val) {
      this.orderListPage.pageSize = val;
      this.getOrderList();
    },

    goBackSearch() {
      //清空搜索信息
      this.searchIncomeSele.orderStatus = "";
      this.searchIncomeSele.orderType = ""
      this.searchIncomeSele.time = null;
      this.searchIncomeSele.userName = "";
      this.searchIncomeSele.phone = "";
      this.orderListPages.pageNum = 1;
      this.orderListPages.pageSize = 5;
      this.searchPageShow = false;
      this.getOrderList();
    },

    //查询orderList
    async sumitSearchOrderList() {
      this.tableisLoading = true;
      let {
        orderStatus,
        time,
        userName,
        phone,
        orderType
      } = this.searchIncomeSele;
      if (
        !orderStatus.trim() &&
        !userName.trim() &&
        !phone.trim() &&
        !time &&
        !orderType
      ) {
        this.$message({
          type: "warning",
          message: "请输入搜索条件！"
        });
        //不显示 搜索分页
        this.searchPageShow = false;
        this.tableisLoading = false;
        //重新调用
        this.getOrderList();
      } else {
        //渲染  查询的

        //先清空 列表
        this.orderListData = [];
        let before;
        let after;
        if (!this.searchIncomeSele.time) {
          before = "";
          after = "";
        } else {
          before = this.searchIncomeSele.time[0];
          after = this.searchIncomeSele.time[1];
        }
        try {
          let d = await selectOrderByRole({
            userName: userName.trim(),
            phone: phone.trim(),
            before,
            after,
            orderStatus,
            orderType,
            pageSize: this.orderListPages.pageSize,
            pageNum: this.orderListPages.pageNum
          });
          if (d.data[0].length === 0) {
            //关闭loading
            this.tableisLoading = false;
            //不显示搜索分页
            this.searchPageShow = false;
            this.$message({
              type: "warning",
              message: "搜索到0条记录！"
            });
            return this.getOrderList();
          }

          d.data[0].forEach(item => {
            item.orderImg = item.orderImg.split(",");
            item.orderImg = item.orderImg.slice(0, item.orderImg.length - 1);
          });
          this.orderListData = d.data[0];
          this.bigSrcList = [];
          this.orderListData.forEach(item => {
            item.orderImg.forEach(items => {
              this.bigSrcList.push(items);
            });
          });
          this.tableDataLengths = d.data[1];
          //关闭loading
          this.tableisLoading = false;
          //显示搜索分页
          this.searchPageShow = true;
        } catch (e) {
          //关闭loading
          this.tableisLoading = false;
          //不显示搜索分页
          this.searchPageShow = false;
          this.$message({
            type: "warning",
            message: "服务器响应失败"
          });
          //回调
          this.getOrderList();
        }
      }
    },

    //查询后的分页
    handleCurrentChanges(val) {
      this.orderListPages.pageNum = val;
      this.sumitSearchOrderList();
    },
    //更改每页条数
    handleSizeChanges(val) {
      this.orderListPages.pageSize = val;
      this.sumitSearchOrderList();
    }
  },
  created() {
    this.getOrderList();
  },
  deactivated() {},
  activated() {
    this.searchIncomeSele.orderStatus = "";
    this.searchIncomeSele.time = null;
    this.searchIncomeSele.userName = "";
    this.searchIncomeSele.phone = "";
    this.searchIncomeSele.orderType = ""
    this.orderListPages.pageNum = 1;
    this.orderListPages.pageSize = 5;
    this.searchPageShow = false;
    this.getOrderList();
  }
};
</script>

<style scoped lang="less">
</style>