$(function(){
    // 点击“去注册账号”
    $('#goReg').on('click',function(e){
        // 将登录盒子隐藏，将注册盒子显示
        $("#loginBox").hide()
        $("#regBox").show()
    })

    // 点击“去登录”
    $('#goLogin').on('click',function(e){
        // 将登录盒子隐藏，将注册盒子显示
        $("#regBox").hide()
        $("#loginBox").show()
    })

    // 自定义校验规则
    // 获取到layui提供的form对象
    const form = layui.form

    // 使用layui提供的友好提示
    const layer = layui.layer

    form.verify({
        // 这个函数接受的value是当前使用这个规则的input框内容
        same:function(value){
            var pwd = $('#pwd').val()
            // console.log(pwd,value)
            if(pwd !== value){
                return '两次输入密码不一致！'
            }
                
        },

        // 这条规则规定密码必须为6-12位非空数字
        pwd:[/^[\S]{6,12}$/,'密码必须为6-12位数字，且不能包含空格']

    })



    $("#regForm").submit(function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // servilize函数获得表单所有input框属性值
        let temp = $(this).serialize()
        // 向后台发起一次post请求
        $.post('/api/reg',temp,function(res){
            if(res.code !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功!请登录')
            // 模拟人的点击事件，跳转到登录页面
            $('#goLogin').click()
        })
    })

    $("#loginForm").submit(function(e){
        e.preventDefault()
        let temp = $(this).serialize()
        $.post('/api/login',temp,function(res){
            // console.log(res)
            // 判断是否成功登录
            if(res.code !== 0 ){
                layer.msg('用户名或密码错误！')
                return
            }
            layer.msg(res.message)
            setTimeout(function(){
                // 将服务器返回的token保存本地
                localStorage.setItem('token',res.token)
                // 跳转到主页面（有权限）
                location.href = '../../index.html'
            },1000)
            
        })
    })

    // 每次回到登录页就清空token
    localStorage.removeItem('token')
})