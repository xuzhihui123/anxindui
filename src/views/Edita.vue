<template>
  <div class="tinymce-box">
    <editor v-model="myValue"
            ref="edit"
            :init="init"
            :disabled="disabled"
    >
    </editor>
  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入不显示
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  import 'tinymce/icons/default/icons'
  // 编辑器插件plugins
  // 更多插件参考：https://www.tiny.cloud/docs/plugins/
  import 'tinymce/plugins/image'// 插入上传图片插件
  import 'tinymce/plugins/media'// 插入视频插件
  import 'tinymce/plugins/table'// 插入表格插件
  import "tinymce/plugins/link";
  import "tinymce/plugins/code";
  import 'tinymce/plugins/lists'// 列表插件
  import 'tinymce/plugins/wordcount'// 字数统计插件
  import "tinymce/plugins/colorpicker";
  import "tinymce/plugins/textcolor";
  import "tinymce/plugins/contextmenu";
  import "tinymce/plugins/preview"
  import "tinymce/plugins/hr"

  import {upLoadImg} from 'network/commandBank'
  let that;
  export default {
    components: {
      Editor
    },
    name: 'tinymce',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table wordcount link code powerpaste preview hr'
      },
      toolbar: {
        type: [String, Array],
        default: "fontselect fontsizeselect  hr link lineheight forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image media quicklink h2 h3 blockquote table numlist bullist fullscreen" //工具栏
      },
      height:{
        type:Number,
        default(){
          return 600
        }
      },
      baseValue:{
        type:String,
        default(){
          return ''
        }
      }
    },
    data() {
      return {
        init: {
          images_upload_url:'http://192.168.3.47:8081/imgUpload',
          language_url: '/tinymce/langs/zh_CN.js',
          font_formats: "微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times", //字体
          fontsize_formats: "12px 14px 16px 18px 20px 24px 26px 28px 30px 32px 36px", //字体大小
          language: 'zh_CN',
          skin_url: '/tinymce/skins/ui/oxide',
          // skin_url: 'tinymce/skins/ui/oxide-dark',//暗色系
          paste_data_images: true, //允许粘贴图像
          // emoticons_database_url: '/tinymce/emojis.js', //表情的放在静态资源下
          menubar: false,
          height: this.height,
          plugins: this.plugins, //插件
          toolbar: this.toolbar, //toolbar 工具条
          branding: false,
          external_plugins: {
            'powerpaste': '/tinymce/powerpaste/plugin.min.js'  //word文档黏贴的插件
          },
          //上传图片的时候调用后台返回 链接
          images_upload_handler: async (blobInfo, success, failure) => {
            let files = blobInfo.blob()
            let f = new FormData()
            f.append('file', files)
            try {
              let d = await upLoadImg(f)
              console.log(d.data);
              success(d.data)
            } catch (e) {
              this.$message({
                type: 'warning',
                message: '上传失败！服务器错误！'
              })
            }
          },
        },
        myValue: '',
      }
    },
    mounted() {
    },
    created() {
      that = this
    },
    methods: {

    },
    watch: {
      myValue(newValue){
          this.$emit('getVaue',newValue+'<style>*{margin: 0;padding: 0} img{max-width: 100%!important} table{max-width: 100%!important;}</style>')
      },
      baseValue(newValue){
        this.myValue = newValue
      }
    }
  }

</script>
<style scoped lang="less">


</style>