<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/noticeList' }">公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--       头部搜索-->
    <el-form :inline="true" :model="searchNotice" class="demo-form-inline" style="margin-top: 20px" v-show="adminPower===1 ? true : false">
      <el-form-item label="搜索：">
        <el-input v-model="searchNotice.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
                v-model="searchNotice.time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                align="left"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitSearch">确认</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goBackSearch">返回</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="addNotice">添加</el-button>
      </el-form-item>
    </el-form>

    <!--    表格开始-->
    <!--    表格开始-->
    <el-card class="box-card" v-loading="isLoading" v-show="adminPower===1 ? true : false">
      <el-table
              :data="tableData"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="index"
                label="#"
                width="50">
        </el-table-column>
        <el-table-column
                prop="noticeTitle"
                label="公告标题"
                width="180">
        </el-table-column>
        <el-table-column
                label="封面"
                align="center"
                width="180">
          <template slot-scope="scope">
            <el-image :src="scope.row.noticeImg" :preview-src-list="previewList">
              <div slot="error" class="image-slot">
                暂无图片
              </div>
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
                prop="noticeIntro"
                label="公告简介"
                width="500">
        </el-table-column>
        <el-table-column
                sortable
                width="180"
                prop="noticeCreateTime"
                label="发布时间">
        </el-table-column>
        <el-table-column
                label="操作"
                fixed="right"
                width="180"
                align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editNoticeItem(scope.row['noticeId'])"
            >
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button size="mini" type="danger" @click="deleteNoticeItem(scope.row['noticeId'])"
            >
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--    分页-->
      <el-pagination
              v-show="!isShowSearchPage"
              style="margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="noticeListParams.pageNum"
              :page-sizes="[5,10,15,20]"
              :page-size="noticeListParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="noticeListTotal">
      </el-pagination>


      <!--      搜索分页-->
      <el-pagination
              v-show="isShowSearchPage"
              style="margin-top: 20px"
              @size-change="handleSearchSizeChange"
              @current-change="handleSearchCurrentChange"
              :current-page="noticeListSearchParams.pageNum"
              :page-sizes="[5,10,15,20]"
              :page-size="noticeListSearchParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="noticeListTotalll">
      </el-pagination>
    </el-card>

    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>
  import {getNoticeListByPage, removeNoticeById} from 'network/notice'
  import show from '@/mixs/show'
  export default {
    name: "NoticeList",
    mixins: [show],
    data() {
      return {
        //搜索条件
        searchNotice: {
          title: '',
          time: null,
        },
        //表格加载
        isLoading: false,
        //总数
        noticeListTotal: null,
        //分页
        noticeListParams: {
          pageNum: 1,
          pageSize: 5
        },

        //搜索分页
        noticeListSearchParams: {
          pageNum: 1,
          pageSize: 5
        },
        //搜索分页总数
        noticeListTotalll: null,
        //显示搜索分页
        isShowSearchPage: false,
        //列表数据
        tableData: [],
        previewList: []
      }
    },
    methods: {
      //获取列表
      async getPageByGetNoticeList() {
        this.isLoading = true
        let {pageNum, pageSize} = this.noticeListParams
        try {
          let d = await getNoticeListByPage({pageNum, pageSize})
          this.tableData = d.data[0]
          //添加大图
          this.tableData.forEach(item => {
            if (item.noticeImg) {
              this.previewList.push(item.noticeImg)
            }
          })
          this.noticeListTotal = d.data[1]
          this.isLoading = false
        } catch (e) {
          this.isLoading = false
          this.$message({
            type: 'error',
            message: '服务器响应失败'
          })
        }
      },


      //搜索
      async submitSearch() {
        this.isLoading = true
        let {title, time} = this.searchNotice
        let before
        let after
        if (time) {
          before = time[0]
          after = time[1]
        } else {
          before = ''
          after = ''
        }
        let {pageNum, pageSize} = this.noticeListSearchParams
        if (!title && !time) {
          this.isLoading = false
          return this.$message({
            type: 'warning',
            message: '请输入搜索条件！'
          })
        } else {
          try {
            let d = await getNoticeListByPage({
              pageNum,
              pageSize,
              title,
              before,
              after
            })
            let [data, count] = d.data
            if (data.length === 0 && count === 0) {
              this.isLoading = false
              //没有搜索到 不做任何操作
              return this.$message({
                type: 'warning',
                message: '暂无该搜索条件的内容！'
              })
            } else {
              this.isLoading = false
              //显示  搜索分页
              this.isShowSearchPage = true
              //搜索分页总数
              this.noticeListTotalll = count
              this.tableData = data
            }
          } catch (e) {
            this.isLoading = false
            return this.$message({
              type: 'error',
              message: '服务器响应失败！'
            })
          }
        }
      },
      //退出搜索
      goBackSearch() {
        //要把搜索分页设置为原来   不显示搜索分页组件
        this.noticeListSearchParams.pageNum = 1
        this.noticeListSearchParams.pageSize = 5
        this.isShowSearchPage = false
        //重新调用原来的获取
        this.getPageByGetNoticeList()
      },
      //更改当前页
      handleCurrentChange(val) {
        this.noticeListParams.pageNum = val;
        this.getPageByGetNoticeList()
      },
      //更改每页条数
      handleSizeChange(val) {
        this.noticeListParams.pageSize = val;
        this.getPageByGetNoticeList()
      },


      //搜索的
      handleSearchSizeChange(val) {
        this.noticeListSearchParams.pageSize = val;
        this.submitSearch()
      },
      //更改每页条数
      handleSearchCurrentChange(val) {
        this.noticeListSearchParams.pageNum = val;
        this.submitSearch()
      },

      //编辑
      editNoticeItem(id) {
        this.$router.push(`/home/editNotice/${id}`)
      },
      //删除
      deleteNoticeItem(id) {
        this.$confirm('确定删除公告吗？此操作不可逆', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            let d = await removeNoticeById(id)
            if (d) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            }
            this.getPageByGetNoticeList()
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
      //添加
      addNotice() {
        this.$router.push('/home/addNotice')
      }
    },
    created() {
      this.getPageByGetNoticeList()
    }
  }
</script>

<style scoped lang="less">

</style>