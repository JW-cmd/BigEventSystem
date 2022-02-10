$(function(){

    let form = layui.form
    const layer = layui.layer

    form.verify({
        nick:[/^[\S]{1,6}$/,'昵称必须是1到6位非空格字符！']
    })

    // 首先渲染用户信息，再进行修改
    randerUser()
    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        let newInfo = $(this).serialize()
        changeUserInfo(newInfo)

    })

    // 给重置按钮绑定点击事件
    $('.layui-form').on('reset',function(e){
        // 阻止默认重置事件，使得重置为之前的数据而不是单纯的清空
        e.preventDefault()
        // 因为没有提交修改，所以重新发起一次获取用户信息的请求即可
        randerUser()
    })
})

// 渲染用户信息
function randerUser(){
    var form = layui.form

    // 将本地仓库中取出的数据转换成相应格式   存在本地仓库中不安全
    // let tempUser = JSON.parse(localStorage.getItem('userInfo'))
        $.ajax({
            type:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.code !== 0){
                    layer.msg(res.message)
                }
                form.val('form_UserInfo',res.data)
            }
        })
}

function changeUserInfo(newInfo){

    $.ajax({
        type:'PUT',
        url:'/my/userinfo',
        data:newInfo,
        success:function(res){
            layer.msg(res.message)
            // setTimeout(function(){
            //     // 不能直接跳转页面，因为此时是在iframe窗口下，跳转的页面会显示在iframe窗口中
            //     // location.href = '/index.html'
            // },1000)
            // window ---- 当前窗口，这里是iframe窗口
            // .parent ---- 父窗口，这里就是index.html
            window.parent.getUserInfo()
        }
    })
}