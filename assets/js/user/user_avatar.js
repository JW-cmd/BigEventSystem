$(function(){
     // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    const layer = layui.layer
    // 1.2 配置对象
    const options = {
        // 纵横比 即裁剪区域的宽高比
        aspectRatio: 1,
        // 指定预览区域在哪里，这里是所有类名为.img-preview都为预览区
        preview: '.img-preview',
        // 视图模式
         viewMode: 2
    }

        // 1.3 创建裁剪区域
        $image.cropper(options)

    
    // 为“选择图片”绑定单击事件
    $('#btn_choose').on('click',function(){
        // 单机“选择图片”时，uploadFile被模拟点击
        $('#uploadFile').click()
    })

    // 更换裁剪的图片---- 为uploadFile绑定change事件
    $('#uploadFile').on('change',function(e){
        // 判断用户有没有选择图片
        const files = e.target.files
        if(files.length === 0)
        return layer.msg('未选择图片！')
        // 拿到用户选择的图片
        var file = files[0]
        // 为图片创建一个URL地址
        var newImgURL = URL.createObjectURL(file)
        // 将裁剪区域的原图片销毁，src更换为当前图片的URL
        $image.cropper('destroy').attr('src',newImgURL).cropper(options)

    })

    // 为btn_upload绑定点击事件
    $('#btn_upload').on('click',function(){
        // 将用户选择并裁剪好的图片转换为base64格式的字符串
    var dataURL = $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 发起ajax请求，提交头像
    $.ajax({
        type:'PATCH',
        url:'/my/update/avatar',
        data:{
            avatar:dataURL,
        },
        success:function(res){
            if(res.code !== 0)
            return layer.msg('头像更换失败！')

            layer.msg(res.message)
            window.parent.getUserInfo()
        }
    })
    })
    
})