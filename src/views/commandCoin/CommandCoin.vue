<template>
  <div v-loading="initLoading">
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>兑换卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>兑换卷管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--         查询信息-->
    <el-form :inline="true" :model="searchBankCoins" class="demo-form-inline" style="margin-top: 20px"
             v-show="adminPower===1 ? true : false">
      <el-form-item label="请选择银行：">
        <el-select v-model="searchBankCoins.region" placeholder="请选择">
          <el-option :label="item.bankName" :value="item.bankId" v-for="item in listData"
                     :key="item.bankId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSearch">查询</el-button>
      </el-form-item>

      <el-form-item v-show="isAddShow">
        <el-button type="success" @click="addCoin">添加兑换卷</el-button>
      </el-form-item>
    </el-form>

    <!--        表格开始-->
    <div v-show="adminPower===1 ? true : false">
      <el-card class="my-card" style="margin-top: 20px" v-loading="isLoading" v-show="isShowTable">
        <el-table
                :data="coinData"
                border
                stripe
                style="width: 100%">
          <el-table-column
                  type="index"
                  label="#"
                  width="50">
          </el-table-column>
          <el-table-column
                  prop="coinName"
                  label="兑换卷名称"
          >
          </el-table-column>
          <el-table-column
                  prop="coinMsg"
                  label="优势"
          >
          </el-table-column>

          <el-table-column
                  prop="coinStart"
                  label="起兑单位"
          >
          </el-table-column>

          <el-table-column
                  prop="coinCount"
                  label="兑换次数"
          >
          </el-table-column>

          <el-table-column
                  prop="coinKey"
                  label="会员积分价值"
          >
          </el-table-column>

          <el-table-column
                  prop="coinProxyKey"
                  label="代理积分价值"
          >
          </el-table-column>

<!--          <el-table-column-->
<!--                  prop="coinOrgKey"-->
<!--                  label="机构积分价值"-->
<!--          >-->
<!--          </el-table-column>-->

          <el-table-column
                  label="操作"
                  fixed="right"
                  width="200"
                  align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="editCoin(scope.row['coinId'])"
              >
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button size="mini" type="danger" @click="deleteCoin(scope.row['coinId'])"
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
                :current-page="coinListData.pageNum"
                :page-sizes="[5,10,15]"
                :page-size="coinListData.pageSize"
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
    getCoinByBankIdByPage,
    removeSingleCoin,
  } from 'network/commandBank'
  import show from '@/mixs/show'

  export default {
    name: "CommandCoin",
    mixins: [show],
    data() {
      return {
        searchBankCoins: {
          region: ''
        },
        listData: [],
        isLoading: true,

        activeShow: '',

        isAddShow: false,


        //初始化loading
        initLoading: true,

        //兑换卷列表信息
        coinData: [],

        //兑换卷分页
        coinListData: {
          pageNum: 1,
          pageSize: 5
        },
        orgCoinListData: {
          pageNum: null,
          pageSize: null
        },
        orginCoinListData: {
          pageNum: null,
          pageSize: null
        },
        tableDataLength: 0,

        //是否显示表格
        isShowTable: false,

      }
    },
    methods: {
      //进入获取银行列表信息
      async getAllBankList() {
        try {
          let d = await getAllBankList()
          this.listData = d
          this.initLoading = false
        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应错误！'
          })
        }
      },

      //删除重新刷新
      async refreshList() {
        this.isLoading = true
        let da = await getCoinByBankIdByPage(this.searchBankCoins.region, this.coinListData.pageNum, this.coinListData.pageSize)

        this.coinData = da.data
        this.isLoading = false
      },

      //查询 银行对应的 兑换卷信息
      async submitSearch() {
        this.isLoading = true
        this.isShowTable = true
        if (!this.searchBankCoins.region) {
          this.isLoading = false
          return this.$message(
              {
                type: 'warning',
                message: '请选择银行！'
              }
          )
        }
        try {
          let d = await getCoinByBankId(this.searchBankCoins.region)

          //获取总数
          if (d.code === 200) this.tableDataLength = d.data.length

          let da = await getCoinByBankIdByPage(this.searchBankCoins.region, this.coinListData.pageNum, this.coinListData.pageSize)

          this.coinData = da.data

          this.isLoading = false
        } catch (e) {
          this.isLoading = false
          this.$message({
            type: 'error',
            message: '服务器响应错误！'
          })
        }
      },


      //分页操作
      //更改当前页
      handleCurrentChange(val) {
        this.coinListData.pageNum = val;
        this.isLoading = true
        this.submitSearch();
      },
      //更改每页条数
      handleSizeChange(val) {
        this.coinListData.pageSize = val;
        this.isLoading = true
        this.submitSearch();
      },

      //编辑兑换卷
      async editCoin(coinId) {
        this.activeShow = 'edit'
        this.$router.push(`/home/editCoin/${coinId}`)
      },

      //删除兑换卷
      async deleteCoin(coinId) {
        this.$confirm('删除兑换卷将删除后续相对应的产品等信息，不建议删除', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$message({
            message: '正在删除中，请稍后~'
          })
          try {
            let data = await removeSingleCoin(coinId)
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.refreshList()
            }
          } catch (e) {
            this.$message({
              type: 'error',
              message: '服务器错误！'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //添加兑换卷
      addCoin() {
        this.activeShow = 'add'
        this.$router.push(`/home/addCoin/${this.searchBankCoins.region}`)
      },


      // 关闭前的回调
      handleClose(done) {
        this.$confirm("确认关闭？")
            .then(_ => {
              done();
            })
            .catch(_ => {
            });
      },


    },
    created() {
      this.getAllBankList()
    },
    activated() {
      if (this.activeShow === 'add') {
        this.coinListData.pageNum = 1;
        this.coinListData.pageSize = 5;
        //重新获取
        this.submitSearch()
      }
      if (this.activeShow === 'edit') {
        // this.coinListData.pageNum = 1;
        // this.coinListData.pageSize = 5;
        //重新获取
        this.submitSearch()
      }
      this.getAllBankList()
    },
    deactivated() {
      // this.orginCoinListData.pageNum = this.coinListData.pageNum
      // this.orginCoinListData.pageSize = this.coinListData.pageSize
      // this.activeShow = true
    },
    watch: {
      'searchBankCoins': {
        deep: true,
        handler: function (newV) {
          if (typeof (newV.region) === 'number') {

            this.coinListData.pageNum = 1;
            this.coinListData.pageSize = 5;
            this.isAddShow = true
          } else {
            this.isAddShow = false
          }
        }
      }
    },
  }
</script>

<style scoped lang="less">

</style>