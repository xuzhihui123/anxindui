<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/noticeList' }">公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑公告</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card style="margin-top: 20px" v-loading="showCard"  v-show="adminPower===1 ? true : false">
        <el-form :model="editNoticeData" status-icon ref="editUserForm"
                 label-width="120px" class="demo-ruleForm" :rules="addNoticeDataRules">
          <el-form-item label="公告标题" prop="noticeTitle">
            <el-input type="text" v-model="editNoticeData.noticeTitle" clearable></el-input>
          </el-form-item>

          <el-form-item label="选择图片">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="http://www.dui1688.com/imgUpload"
                    :multiple="false"
                    :on-remove="handleRemove1"
                    :limit="1"
                    :on-change="changeFile1"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button size="small" type="success" style="margin-left:10px" v-show="isShowClearImg" @click="clearImg">
                清空图片
              </el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，只能上传一张</div>
            </el-upload>
          </el-form-item>

          <el-form-item v-show="showImg">
            <img :src="imgSrc" alt="" style="width: 200px;">
          </el-form-item>

          <el-form-item label="公告简介" prop="noticeIntro">
            <el-input type="text" v-model="editNoticeData.noticeIntro" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card style="margin-top: 20px" v-show="adminPower===1 ? true : false">
        <edita @getVaue="getValues" :base-value='editNoticeData.noticeContent'/>

        <el-button type="primary" @click="submitAddNotice" :loading="submitLoading"
                   style="margin-top: 40px;margin-left: 90%">确认
        </el-button>
      </el-card>

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
                 :style="{'width': '224.7px', 'height':'123.6px',  'overflow': 'hidden'}">
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
  </div>
</template>

<script>
  import {getNoticeById, updateNoticeById} from 'network/notice'
  import {
    upLoadImg,
  } from 'network/commandBank'
  import {fileToBase, dataURLtoFile} from 'commonjs/fileToBase64'

  import Edita from "views/Edita";
  import {VueCropper} from 'vue-cropper'
  import show from '@/mixs/show'
  export default {
    name: "AddNotice",
    mixins: [show],
    data() {
      return {
        //添加按钮 加载
        submitLoading: false,
        //富文本
        noticeContent: null,

        editNoticeData: {},

        //rules
        addNoticeDataRules: {
          noticeTitle: [
            {required: true, trigger: 'change', message: '请输入公告标题！'}
          ],
          noticeIntro: [
            {required: true, trigger: 'change', message: '请输入公告简介！'}
          ]
        },

        fileList: {
          name: '',
          url: ''
        },

        //截图后的地址
        imgSrc: '',

        //是否显示图片
        showImg: false,

        //裁减框显示
        cropperVisible: false,

        //清空图片显示
        isShowClearImg: false,

        //裁减框参数
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
          fixedNumber: [749, 412], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },

        //实时预览属性
        //实时预览属性
        previews: {},

        //剪裁按钮
        loadingCropperButton: false,

        //showCard
        showCard: false,

        noticeId: null
      }
    },
    methods: {

      //一进来获取公告信息
      async getBaseNotice() {
        this.showCard = true
        this.noticeId = this.$route.params.id
        try {
          let d = await getNoticeById(this.noticeId)
          d.noticeImg ? this.imgSrc = d.noticeImg : this.imgSrc = null
          d.noticeImg ? this.showImg = true : this.showImg = false
          d.noticeImg ? this.isShowClearImg = true : this.isShowClearImg = false
          this.editNoticeData = d
          this.showCard = false
        } catch (e) {
          this.showCard = false
          this.$message({
            type: 'error',
            message: '服务器响应失败'
          })
        }

      },


      //确认编辑
      submitAddNotice() {
        this.$refs.editUserForm.validate(async r => {
          if (r) {
            this.submitLoading = true
            this.$message({
              type: 'success',
              message: '正在修改中，请稍后~'
            })
            if(this.imgSrc){
              //如果图片还是原来的就不需要转换上传 直接提交
              if (this.imgSrc.startsWith('http')) {
                let {noticeId, noticeTitle, noticeIntro} = this.editNoticeData
                try {
                  let d = await updateNoticeById({
                    noticeId,
                    noticeTitle,
                    noticeIntro,
                    noticeImg: this.imgSrc,
                    noticeContent: this.noticeContent
                  })
                  //修改成功的话
                  if (d) {
                    this.$message({
                      type: 'success',
                      message: '修改成功~'
                    })
                    this.submitLoading = false
                    this.$router.go(-1)
                  }
                } catch (e) {
                  this.$message({
                    type: 'error',
                    message: '服务器响应失败!'
                  })
                  this.submitLoading = false
                }
                //图片本来就没有的
              } else {
                //不是原来的图片要 先上传
                let file = dataURLtoFile(this.imgSrc, this.fileList.name)
                let f = new FormData()
                f.append('file', file)
                try {
                  let d = await upLoadImg(f)
                  //拿到图片
                  let noticeImg = d.data

                  let {noticeId, noticeTitle, noticeIntro} = this.editNoticeData

                  let data = await updateNoticeById({
                    noticeImg,
                    noticeId,
                    noticeTitle,
                    noticeIntro,
                    noticeContent: this.noticeContent
                  })
                  if (data) {
                    this.submitLoading = true
                    this.$message({
                      type: 'success',
                      message: '修改成功~'
                    })
                    this.$router.go(-1)
                  }
                } catch (e) {
                  this.submitLoading = false
                  return this.$message({
                    type: 'error',
                    message: '服务器响应失败'
                  })
                }
              }
            }else{
              let {noticeId, noticeTitle, noticeIntro} = this.editNoticeData
              try {
                let d = await updateNoticeById({
                  noticeId,
                  noticeTitle,
                  noticeIntro,
                  noticeImg: this.imgSrc,
                  noticeContent: this.noticeContent
                })
                //修改成功的话
                if (d) {
                  this.$message({
                    type: 'success',
                    message: '修改成功~'
                  })
                  this.submitLoading = false
                  this.$router.go(-1)
                }
              } catch (e) {
                this.$message({
                  type: 'error',
                  message: '服务器响应失败!'
                })
                this.submitLoading = false
              }
            }
          } else {
            this.submitLoading = false
            this.$message({
              type: 'warning',
              message: '请检查表单是否完善正确！'
            })
          }
        })
      },

      //获取富文本
      getValues(fwbV) {
        this.noticeContent = fwbV
      },


      changeFile1(file, fileList) {
        let f = file
        let type = f.raw.type
        if (type && (type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg')) {
          //转换成base64
          fileToBase(f.raw).then(r => {
            this.$set(this.fileList, 'name', f.raw.name)
            this.$set(this.fileList, 'url', r)

            //显示裁减框
            this.cropperVisible = true
            this.option.img = this.fileList.url
          })
        } else {
          this.$refs.upload.clearFiles()
          return this.$message({
            type: 'warning',
            message: '请上传指定类型图片！'
          })
        }
      },

      handleRemove1(file, fileList) {
        this.fileList.name = ''
        this.fileList.url = ''
        //一取消赋值原来的值回去
        this.editNoticeData.noticeImg ? this.imgSrc = this.editNoticeData.noticeImg : this.imgSrc = null
        this.editNoticeData.noticeImg ? this.showImg = true : this.showImg = false
      },

      //取消裁剪框
      //点击Cropper的Dialog的取消
      handleCloseCropper(done) {
        this.$confirm("确认关闭？")
            .then(_ => {
              //清空
              this.$refs.upload.clearFiles()
              this.fileList.name = ""
              this.fileList.url = ""
              //一取消赋值原来的值回去
              this.editNoticeData.noticeImg ? this.imgSrc = this.editNoticeData.noticeImg : this.imgSrc = null
              this.editNoticeData.noticeImg ? this.showImg = true : this.showImg = false
              done();
            })
            .catch(_ => {
            });
      },


      //取消裁剪
      //取消剪裁 图片
      cancelCropper() {
        this.$refs.upload.clearFiles()
        this.fileList.name = ""
        this.fileList.url = ""
        this.cropperVisible = false

        //一取消赋值原来的值回去
        this.editNoticeData.noticeImg ? this.imgSrc = this.editNoticeData.noticeImg : this.imgSrc = null
        this.editNoticeData.noticeImg ? this.showImg = true : this.showImg = false
      },

      //确认裁剪
      //确认剪裁图片
      finishCropper() {
        //button loading开启
        this.loadingCropperButton = true

        // 获取截图的base64 数据
        this.$refs.cropper.getCropData(async (data) => {
          setTimeout(() => {
            this.loadingCropperButton = false
            this.cropperVisible = false
            //暂时显示剪裁的图片
            this.imgSrc = data
            this.showImg = true
          }, 1000)
        })
      },


      //实时预览
      //图片剪裁实时小图
      realTime(data) {
        this.previews = data
      },


      //清空图片
      clearImg() {
        this.imgSrc = null
        this.showImg = false
        this.$refs.upload.clearFiles()
        this.fileList.name = ""
        this.fileList.url = ""
        this.isShowClearImg = false
      }
    },
    components: {
      Edita,
      VueCropper
    },
    created() {
      this.getBaseNotice()
    },
    watch:{
      imgSrc:{
        handler(newV){
          if(newV!==null){
            this.isShowClearImg = true
          }else{
            this.isShowClearImg = false
          }
        }
      }
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