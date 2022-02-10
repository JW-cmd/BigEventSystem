// 入口函数
$(function(){
    // 第一步，获取用户信息并渲染到相应位置，前提是已经登录了
    // 一进入首页就会触发渲染
    getUserInfo()

    // 给退出按钮绑定响应事件
    $('#quit').on('click',quit)
})

const layer = layui.layer

// 一进入index页面就获取用户信息
// 坑能是由于浏览器地址栏暴力输入index页面，此时应该判断
function getUserInfo(){
    $.ajax({
        type :'GET',
        url:'/my/userinfo',
        success:function(res){
            // 成功之后调用渲染的函数
            // console.log(res.data)
            if(res.code !==0){
                
                location.href = '../../login.html'
                return layer.msg(res.message) 
            }
            // localStorage存储的是字符串，所以对象不能直接存入，否则会存入值为数据类型名的字符串
            // localStorage.setItem('userInfo',JSON.stringify(res.data))
            randerAvatar(res.data)
        },
        // 直接输入index页面，服务器不会返回数据，
        // 所以此时success函数是没有被调用的，
        // 在这里判断服务器返回的code码无法阻止暴力进入
        // complete函数则不论反问服务器成功还是失败，
        // 都会走的，所以可以在这里判断是否成功访问服务器

        complete:function(res){
            // console.log(res)
            if(res.responseJSON.code !== 0){
                // 强制清除token
                localStorage.removeItem('token')
                location.href = '../../login.html'
                // return layer.msg(res.message)
            }
        }
        
    })

}

// 渲染用户头像、昵称
function randerAvatar(user){
    // console.log(user)
    // 找昵称，有昵称则使用昵称，没有则使用用户名首字母的大写
    var name = user.nickname || user.username
    $('.welcome').html('欢迎！&nbsp' + name)

    // 渲染头像
    // const nickname = (user.nickname || user.username)[0].toUpperCase()

    if(user.user_pic){
        $('.layui-nav-img').attr('src',user.user_pic)
        $('.user-avatar').hide()
    }
    else{
        $('.layui-nav-img').hide()
        $('.user-avatar').html(name[0].toUpperCase())
    }
}

function quit(){
    // 先清空本地存储的token，在跳转网页
    layer.confirm('你确定退出吗？',{icon: 3, title:'提示'},function(index){
        localStorage.removeItem('token')
        location.href = '../../login.html'
        layer.close(index);//layui自带的弹出层序号
    })
    
}