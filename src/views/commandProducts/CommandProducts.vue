<template>
  <div v-loading="initLoading">
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>兑换产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>兑换产品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--       头部搜索-->
    <el-form :inline="true" :model="productsData" class="demo-form-inline" style="margin-top: 20px"  v-show="adminPower===1 ? true : false">
      <el-form-item label="请选择银行">
        <el-select v-model="productsData.bankId" placeholder="请选择">
          <el-option :label="item.bankName" :value="item.bankId" v-for="item in selectBankList"
                     :key="item.bankId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择兑换卷">
        <el-select v-model="productsData.coinId" placeholder="请选择" v-loading="selectCoinLoading">
          <el-option :label="item.coinName" :value="item.coinId" v-for="item in selectCoinList"
                     :key="item.coinId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSearch">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="addPro" v-show="productsData.coinId">添加产品</el-button>
      </el-form-item>
    </el-form>

    <!--        表格开始-->
    <div v-show="adminPower===1 ? true : false">
      <el-card class="my-card" style="margin-top: 20px" v-loading="tableisLoading" v-show="isShowTable">
        <el-table
                :data="proData"
                border
                stripe
                style="width: 100%">
          <el-table-column
                  type="index"
                  label="#"
                  width="50">
          </el-table-column>
          <el-table-column
                  prop="itemScore"
                  label="积分数"
          >
          </el-table-column>
          <el-table-column
                  prop="itemName"
                  label="兑换商品"
          >
          </el-table-column>

          <el-table-column
                  prop="itemTime"
                  label="兑换次数"
          >
          </el-table-column>

          <el-table-column
                  prop="itemPrice"
                  label="会员价"
          >
          </el-table-column>

          <el-table-column
                  prop="itemProxyPrice"
                  label="代理价"
          >
          </el-table-column>

          <el-table-column
                  prop="itemOrgPrice"
                  label="机构价"
          >
          </el-table-column>

          <el-table-column
                  label="操作"
                  fixed="right"
                  width="200"
                  align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="editPro(scope.row['itemId'])"
              >
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button size="mini" type="danger" @click="deletePro(scope.row['itemId'])"
              >
                <i class="el-icon-delete"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--    分页-->
        <el-pagination
                style="margin-top: 20px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="proListData.pageNum"
                :page-sizes="[5,10,15]"
                :page-size="proListData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableDataLength">
        </el-pagination>
      </el-card>
    </div>
    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {
    getAllBankList,
    getCoinByBankId,
    addSingleItem,
    getProductsListByCoinId,
    getItemByCoinIdByPage,  //根据coinId商品分页
    removeProSingle
  } from 'network/commandBank'

  import show from '@/mixs/show'

  export default {
    name: "CommandProducts",
    data() {
      return {
        initLoading: true,
        selectCoinLoading: false,
        productsData: {
          bankId: null,
          coinId: null
        },
        selectBankList: [],
        selectCoinList: [],
        tableisLoading: false,
        isShowTable: false,
        //商品列表
        proData: [],

        //商品分页
        proListData: {
          pageSize: 5,
          pageNum: 1
        },
        //商品总数
        tableDataLength: null,

        //判断是编辑还是添加
        isEditOrAdd: null
      }
    },
    mixins:[show],
    methods: {
      //进入获取银行列表信息
      async getAllBankList() {
        try {
          let d = await getAllBankList()
          this.selectBankList = d
          this.initLoading = false
        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应错误！'
          })
        }
      },

      //根据银行id获取银行兑换卷信息
      async getAllCoins() {
        try {
          let d = await getCoinByBankId(this.productsData.bankId)
          this.selectCoinList = d.data
          this.selectCoinLoading = false
          if (this.selectCoinList[0]) {
            this.productsData.coinId = this.selectCoinList[0].coinId
          } else {
            this.productsData.coinId = null
          }

        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应错误！'
          })
        }
      },

      //确认查询
      async submitSearch() {
        //显示表格
        this.isShowTable = true
        //显示加载
        this.tableisLoading = true
        let coinId = this.productsData.coinId
        if (coinId) {
          try {
            let d = await getProductsListByCoinId(coinId)
            this.tableDataLength = d.data[0].length

            let da = await getItemByCoinIdByPage(this.proListData.pageNum, this.proListData.pageSize, coinId)

            this.proData = da.data

            this.tableisLoading = false
          } catch (e) {
            this.tableisLoading = false
            this.$message(
                {
                  type: 'error',
                  message: '服务器响应失败！'
                }
            )
          }
        } else {
          this.tableisLoading = false
        }
      },

      //编辑产品
      editPro(itemId) {
        this.isEditOrAdd = 'edit'
        this.$router.push(`/home/editPro/${itemId}`)
      },

      //删除产品
      deletePro(itemId) {
        this.$confirm('确定删除该产品信息吗？', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            let d = await removeProSingle(itemId)
            if (d.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })

              //重新获取
              this.submitSearch()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败！'
              })
            }
          } catch (e) {
            this.$message({
              type: 'error',
              message: '服务器响应失败！'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //添加产品
      addPro() {
        this.isEditOrAdd = 'add'
        this.$router.push(`/home/addPro/${this.productsData.coinId}`)
      },


      //分页操作
      //更改当前页
      handleCurrentChange(val) {
        this.proListData.pageNum = val;
        this.submitSearch();
      },
      //更改每页条数
      handleSizeChange(val) {
        this.proListData.pageSize = val;
        this.submitSearch();
      },
    },
    watch: {
      'productsData.bankId': {
        deep: true,
        handler: function (newV) {
          if (newV) {
            this.getAllCoins()
            this.selectCoinLoading = true

            //银行一改变 就清空 数据
            this.proData = []
            //分页也改变
            this.proListData.pageSize = 5
            this.proListData.pageNum = 1
          }
        }
      }
    },
    created() {
      this.getAllBankList()
    },

    deactivated() {
    },
    activated() {
      //如果是编辑的
      if(this.isEditOrAdd === 'edit'){
        this.submitSearch()
      }
      if(this.isEditOrAdd === 'add'){
        //重新获取银行
        this.getAllBankList()
        this.productsData.coinId = null
        this.productsData.bankId = null
        this.proData = []
        //分页也改变
        this.proListData.pageSize = 5
        this.proListData.pageNum = 1
      }
    }
  }
</script>

<style scoped lang="less">

</style>