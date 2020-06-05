/*
 * @Author: Lancer
 * @Date:2020/2/2
 * @Last Modified by:   Lancer
 * @Last Modified time: 2020/2/2
 */

export function fileToBase(obj) {
  var reader = new FileReader(); //实例化文件读取对象
  reader.readAsDataURL(obj); //将文件读取为 DataURL,也就是base64编码
  return new Promise((resolve) => {
    reader.onload = function(ev) { //文件读取成功完成时触发
      var dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
      resolve(dataURL);
    };
  });
}


export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


