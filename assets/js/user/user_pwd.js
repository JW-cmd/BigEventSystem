$(function(){
    var form = layui.form
    var layer = layui.layer

    form.verify({
        same:function(value){
            var pwd = $('.layui-form [name = "new_pwd"]').val()
            // console.log(pwd,value)
            if(pwd !== value){
                return '两次输入密码不一致！'
            }
                
        },
        // 两次密码不能相同
        diff:function(value){
            var pwd = $('.layui-form [name = "old_pwd"]').val()
            // console.log(pwd,value)
            if(pwd === value){
                return '新旧密码不能相同！'
            }
                
        },
        // 这条规则规定密码必须为6-12位非空数字
        pwd:[/^[\S]{6,12}$/,'密码必须为6-12位数字，且不能包含空格']
    })

    // 为表单绑定提交事件
    $('#form_Pwd').on('submit',function(e){
        e.preventDefault()
        // 进行了预验证之后，直接向后端提交修改即可
        $.ajax({
            type:'PATCH',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.code !==0 ){
                    return layer.msg(res.message)
                }
                // 重置表单     .reset()方法DOM对象有该方法，但是jQuery对象没有
                $('#form_Pwd')[0].reset()
                return layer.msg(res.message)
            }
        })
    })
})