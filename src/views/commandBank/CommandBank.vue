<template>
  <div>
    <!--    头部导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>兑换银行管理</el-breadcrumb-item>
      <el-breadcrumb-item>兑换银行管理</el-breadcrumb-item>
    </el-breadcrumb>


    <!--//添加银行-->
    <div style="margin-top: 20px;" v-show="adminPower===1 ? true : false">
      <el-row :gutter="20">
        <!--        <el-col :span="7">-->
        <!--          <el-input placeholder="搜索管理员" @input="searchAdminUserInput" v-model="searchAdminUser"-->
        <!--                    class="input-with-select" clearable>-->
        <!--            <el-button slot="append" icon="el-icon-search" @click="searchAdminUsers"></el-button>-->
        <!--          </el-input>-->
        <!--        </el-col>-->
        <el-col :span="5">
          <el-button type="primary" @click="addBank">添加银行</el-button>
        </el-col>
      </el-row>
    </div>


    <!--        表格开始-->
    <el-card class="my-card" style="margin-top: 20px" v-loading="isLoading" v-show="adminPower===1 ? true : false">
      <el-table
              :data="userData"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="index"
                label="#"
                width="50">
        </el-table-column>
        <el-table-column
                prop="bankName"
                label="银行名称"
        >
        </el-table-column>

        <el-table-column
                label="银行图标"
                align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row['bankIcon']" style="width: 50px;"></el-image>
          </template>
        </el-table-column>

        <el-table-column
                prop="bankQueryMsg"
                label="查一查"
                align="center">
        </el-table-column>


        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editBank(scope.row['bankId'])"
            >
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button size="mini" type="danger" @click="deleteBank(scope.row['bankId'])"
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
              :current-page="bankListData.pageNum"
              :page-sizes="[5,10,15]"
              :page-size="bankListData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataLength">
      </el-pagination>
    </el-card>


    <!--    编辑弹窗-->
    <el-dialog
            title="编辑银行信息"
            :visible.sync="editDialogVisible"
            width="30%"
            :before-close="handleClose"
    >
      <!--      内容模块-->
      <el-form :model="editBankData" status-icon ref="editUserForm"
               label-width="100px" class="demo-ruleForm" :rules="editBankRules">
        <el-form-item label="银行名称" prop="bankName">
          <el-input type="text" v-model="editBankData.bankName" clearable></el-input>
        </el-form-item>
        <el-form-item label="查一查更改" prop="bankQueryMsg">
          <el-input type="text" v-model="editBankData.bankQueryMsg" clearable></el-input>
        </el-form-item>

        <el-form-item prop="adminName">
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="http://www.dui1688.com/imgUpload"
                  :multiple="false"
                  :on-remove="handleRemove"
                  :limit="1"
                  :on-change="changeFile"
                  :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，只能上传一张</div>
          </el-upload>
          <img :src="editBankData.bankIcon" alt="" style="margin-left: 20px;width: 80px;margin-top:20px;">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitEditBank" :loading="editBankButtonLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!--    添加弹窗-->
    <el-dialog
            title="添加银行信息"
            :visible.sync="addDialogVisible"
            width="30%"
            :before-close="handleClose1"
    >
      <!--      内容模块-->
      <el-form :model="addBankData" status-icon ref="addUserForm"
               label-width="100px" class="demo-ruleForm" :rules="addBankRules">
        <el-form-item label="银行名称" prop="bankName">
          <el-input type="text" v-model="addBankData.bankName" clearable></el-input>
        </el-form-item>
        <el-form-item label="查一查更改" prop="bankQueryMsg">
          <el-input type="text" v-model="addBankData.bankQueryMsg" clearable></el-input>
        </el-form-item>

        <el-form-item prop="adminName">
          <el-upload
                  class="upload-demo"
                  ref="upload1"
                  action="http://www.dui1688.com/imgUpload"
                  :multiple="false"
                  :on-remove="handleRemove1"
                  :limit="1"
                  :on-change="changeFile1"
                  :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，只能上传一张</div>
          </el-upload>
          <img :src="addBankData.bankIcon" alt="" style="margin-left: 20px;width: 80px;margin-top:20px;">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitaddBank" :loading="addBankButtonLoading">确 定</el-button>
      </span>
    </el-dialog>


    <!--    银行图片剪裁框-->
    <el-dialog title="图片剪裁" :visible.sync="cropperVisible" append-to-body :before-close="handleCloseCropper">

      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vue-cropper
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber"
                  :centerBox="option.centerBox"
                  :infoTrue="option.infoTrue"
                  :fixedBox="option.fixedBox"
                  @realTime="realTime"
          ></vue-cropper>
        </div>
        <div style="margin-left:20px;margin-top: 10px">
          <div class="show-preview"
               :style="{'width': '150px', 'height':'150px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCropper">取 消</el-button>
        <el-button type="primary" @click="finishCropper" :loading="loadingCropperButton">确认</el-button>
      </div>
    </el-dialog>
    <not-found class="not-found" v-show="adminPower===1 ? false : true" style="top: 50%;left: 50%"/>
  </div>
</template>

<script>

  import {
    getAllBankList, removeBankById, editBank, getBankInfoById, upLoadImg,
    getAllBankListRule, addSingleBank
  } from 'network/commandBank'
  import {fileToBase, dataURLtoFile} from 'utils/fileToBase64'
  import {VueCropper} from 'vue-cropper'
  import show from '@/mixs/show'
  export default {
    name: "CommandBank",
    data() {
      return {
        isAddOrEdit: '',
        userData: [],
        editDialogVisible: false,
        addDialogVisible: false,
        cropperVisible: false,
        editBankData: {
          bankName: '',
          bankQueryMsg: '',
          bankIcon: ''
        },
        addBankData: {
          bankName: '',
          bankQueryMsg: '',
          bankIcon: ''
        },
        addBankRules: {
          bankName: [
            {required: true, message: '请输入银行名称'}
          ],
          bankQueryMsg: [
            {required: true, message: '请输入查一查信息'}
          ],
        },
        banksId: null,
        editBankRules: {
          bankName: [
            {required: true, message: '请输入银行名称'}
          ],
          bankQueryMsg: [
            {required: true, message: '请输入查一查信息'}
          ],
        },
        isLoading: true,
        //头像上传列表
        fileList: {
          name: '',
          url: ''
        },
        fileList1: {
          name: '',
          url: ''
        },
        //剪裁框option
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'jpeg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          // autoCropWidth: 300, // 默认生成截图框宽度
          // autoCropHeight: 200, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },

        //实时预览属性
        previews: {},

        //剪裁图片确认button的loading
        loadingCropperButton: false,

        //确认编辑的button的loading
        editBankButtonLoading: false,

        //addBankButtonLoading 确认添加的button的loading
        addBankButtonLoading: false,


        //剪裁后的base64
        cropperLastImgData: '',

        //记录之前的图片地址
        beforeImgData: '',

        //分页的参数
        bankListData: {
          pageNum: 1,
          pageSize: 5
        },

        //列表总数量
        tableDataLength: null
      }
    },
    mixins:[show],
    methods: {
      //获取所有银行列表
      async getAllBankList() {
        try {
          let d = await getAllBankList()
          this.tableDataLength = d.length

          let da = await getAllBankListRule(this.bankListData.pageNum, this.bankListData.pageSize)

          this.userData = da.data

          this.isLoading = false
        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应失败~'
          })
        }
      },


      deleteBank(bankId) {
        this.$confirm('删除银行将删除后续相对应的产品等信息，不建议删除', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            let d = await removeBankById(bankId)
            if (d.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            }

            this.getAllBankList()

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

      //编辑银行
      async editBank(bankId) {
        this.isAddOrEdit = 'edit'
        try {
          this.banksId = bankId
          let d = await getBankInfoById({bankId})
          let {bankName, bankQueryMsg, bankIcon} = d.data
          this.editBankData.bankName = bankName
          this.editBankData.bankQueryMsg = bankQueryMsg
          this.editBankData.bankIcon = bankIcon
          this.editDialogVisible = true

          //赋值原来的img
          this.beforeImgData = bankIcon
        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      },

      //确认编辑
      submitEditBank() {
        //先判断bankIcon的地址是否base64  是的话不用上传图片  否则上传图片
        let iconSrc = this.editBankData.bankIcon


        this.$refs.editUserForm.validate(async r => {
          if (r) {
            this.$message({
              message: '资料更改中,请稍后~'
            })
            this.editBankButtonLoading = true
            //base64就需要上传到服务器
            if (iconSrc.startsWith('data:')) {
              let data = this.cropperLastImgData
              let file = dataURLtoFile(data, this.fileList.name)
              let f = new FormData()
              f.append('file', file)
              let d = await upLoadImg(f)

              //获取到url 储存到数据库
              let url = d.data

              let editBankData = await editBank({
                bankId: this.banksId,
                bankName: this.editBankData.bankName,
                bankQueryMsg: this.editBankData.bankQueryMsg,
                bankIcon: url
              })
              if (editBankData.code === 200) {
                this.$message({
                  type: 'success',
                  message: '更新成功！'
                })
                this.getAllBankList()

                this.editBankButtonLoading = false
                this.editDialogVisible = false
                this.cropperLastImgData = ""
                this.$refs.upload.clearFiles()
                this.fileList.name = ""
                this.fileList.url = ""
              } else {
                this.editBankButtonLoading = false
                this.$message({
                  type: 'success',
                  message: '更新失败！'
                })
              }
            } else {
              //不需要上传图片  直接更改内容
              let editBankData = await editBank({
                bankId: this.banksId,
                bankName: this.editBankData.bankName,
                bankQueryMsg: this.editBankData.bankQueryMsg
              })
              if (editBankData.code === 200) {
                this.$message({
                  type: 'success',
                  message: '更新成功！'
                })
                //更新成功 重新获取列表
                this.getAllBankList()

                this.editBankButtonLoading = false
                this.editDialogVisible = false
                this.cropperLastImgData = ""
                this.$refs.upload.clearFiles()
                this.fileList.name = ""
                this.fileList.url = ""
              } else {
                this.$message({
                  type: 'success',
                  message: '更新失败！'
                })
              }
            }
          } else {
            this.$message({
              type: 'error',
              message: '请检查表单信息是否准确!'
            })
          }
        })


      },


      // 关闭前的回调
      handleClose(done) {
        this.$confirm("确认关闭？")
            .then(_ => {
              this.$refs.upload.clearFiles()
              this.cropperLastImgData = ''
              done();
            })
            .catch(_ => {
            });
      },
      handleClose1(done) {
        this.$confirm("确认关闭？")
            .then(_ => {
              this.$refs.upload1.clearFiles()
              this.addBankData.bankIcon = ''
              this.fileList1.name = ''
              this.fileList1.url = ''
              done();
            })
            .catch(_ => {
            });
      },


      //以下是银行图片上传


      handleRemove(file, fileList) {
        this.fileList.name = ''
        this.fileList.url = ''

        //把显示的图片赋值为空
        this.cropperLastImgData = ''

        //把图片赋值为原来的Icon
        this.editBankData.bankIcon = this.beforeImgData
      },

      handleRemove1(file, fileList) {
        this.fileList1.name = ''
        this.fileList1.url = ''
        this.addBankData.bankIcon = ''
      },


      changeFile(file, fileList) {
        let f = file
        let type = f.raw.type
        if (type && (type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg')) {
          //转换成base64
          fileToBase(f.raw).then(r => {
            this.fileList.name = f.raw.name
            this.fileList.url = r

            //转换后显示cropper裁剪
            this.cropperVisible = true
            //赋值路径显示图片
            this.option.img = r
          })
        } else {
          this.$refs.upload.clearFiles()
          return this.$message({
            type: 'warning',
            message: '请上传指定类型图片！'
          })
        }
      },

      changeFile1(file, fileList) {
        let f = file
        let type = f.raw.type
        if (type && (type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg')) {
          //转换成base64
          fileToBase(f.raw).then(r => {
            this.fileList1.name = f.raw.name
            this.fileList1.url = r

            //转换后显示cropper裁剪
            this.cropperVisible = true
            //赋值路径显示图片
            this.option.img = r
          })
        } else {
          this.$refs.upload1.clearFiles()
          return this.$message({
            type: 'warning',
            message: '请上传指定类型图片！'
          })
        }
      },

      //图片剪裁实时小图
      realTime(data) {
        this.previews = data
      },

      //确认剪裁图片
      finishCropper() {
        if (this.isAddOrEdit === 'edit') {
          //button loading开启
          this.loadingCropperButton = true

          // 获取截图的base64 数据
          this.$refs.cropper.getCropData(async (data) => {
            setTimeout(() => {
              this.cropperLastImgData = data
              this.loadingCropperButton = false
              this.cropperVisible = false

              //暂时显示剪裁的图片
              this.editBankData.bankIcon = data
            }, 1000)
          })
        } else {
          this.loadingCropperButton = true
          this.$refs.cropper.getCropData(async (data) => {
            setTimeout(() => {
              this.loadingCropperButton = false
              this.cropperVisible = false

              //暂时显示剪裁的图片
              this.addBankData.bankIcon = data
            }, 1000)
          })
        }
      },


      //取消剪裁 图片
      cancelCropper() {
        if (this.isAddOrEdit === 'edit') {
          this.cropperVisible = false
          //清空
          this.$refs.upload.clearFiles()
          this.fileList.name = ""
          this.fileList.url = ""
        } else {
          this.cropperVisible = false
          this.$refs.upload1.clearFiles()
          this.fileList1.name = ""
          this.fileList1.url = ""
        }
      },

      //点击Cropper的Dialog的取消
      handleCloseCropper(done) {
        this.$confirm("确认关闭？")
            .then(_ => {
              //清空
              if (this.isAddOrEdit === 'edit') {
                this.$refs.upload.clearFiles()
                this.fileList.name = ""
                this.fileList.url = ""
                done();
              } else {
                this.$refs.upload1.clearFiles()
                this.fileList1.name = ""
                this.fileList1.url = ""
                done();
              }
            })
            .catch(_ => {
            });
      },


      //分页操作
      //更改当前页
      handleCurrentChange(val) {
        this.bankListData.pageNum = val;
        this.isLoading = true
        this.getAllBankList();
      },
      //更改每页条数
      handleSizeChange(val) {
        this.bankListData.pageSize = val;
        this.isLoading = true
        this.getAllBankList();
      },

      //添加银行
      addBank() {
        this.isAddOrEdit = 'add'
        this.addDialogVisible = true
      },

      //确认添加银行
      submitaddBank() {
        this.$refs.addUserForm.validate(async r => {
          if (r) {
            this.$message({
              message: '添加中,请稍后~'
            })
            this.addBankButtonLoading = true
            //base64就需要上传到服务器
            let data = this.addBankData.bankIcon
            let file = dataURLtoFile(data, this.fileList1.name)
            let f = new FormData()
            f.append('file', file)
            let d = await upLoadImg(f)

            //获取到url 储存到数据库
            let url = d.data

            let addBank = await addSingleBank({
              bankName: this.addBankData.bankName,
              bankQueryMsg: this.addBankData.bankQueryMsg,
              bankIcon: url
            })
            if (addBank.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.getAllBankList()

              this.addBankButtonLoading = false
              this.addDialogVisible = false
              this.$refs.upload1.clearFiles()
              this.fileList1.name = ""
              this.fileList1.url = ""
              this.addBankData.bankIcon = ''
            } else {
              this.addBankButtonLoading = false
              this.$message({
                type: 'success',
                message: '添加失败！'
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '请检查表单信息是否准确!'
            })
          }
        })
      }


    },
    created() {
      this.getAllBankList()
    },
    components: {
      VueCropper
    }

  }
</script>

<style scoped lang="less">
  .cropper-content {
    .cropper {
      width: auto;
      height: 300px;
    }
  }
</style>