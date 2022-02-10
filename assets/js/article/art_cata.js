var layer = layui.layer
var layerOpen = ''//添加类别
var layerEdit = ''//编辑分类
var layerDelete = ''//删除分类
var form = layui.form
$(function(){

    // 获取所有类别数据
    getAllCate()

    // 为添加类别按钮绑定点击事件
    $('#addCate').on('click',function(){
        // 获取要赋值给content的代码----获取#layerForm的script标签，并通过.html()获取script中的代码
        const addCateStr = $('#layerForm').html()
        // 点击后出现添加类别界面
        layerOpen = layer.open({
            title:'添加分类',
            // 内部内容，是html代码，同样采用模板的方法，拿到.html中的HTML代码
            content:addCateStr,
            // 指定弹出层类型，默认值为0（表示信息框），1-- 代表弹出的是页面层
            type:1,
            area:['500px','250px']
        })
    })

    // 监听添加类别表单,通过父元素代理给addCateForm
    $('body').on('submit','#addCateForm',function(e){
        e.preventDefault()
        const temp = $('#addCateForm').serialize()
        $.ajax({
            type:'post',
            url:'/my/cate/add',
            data:temp,
            success:function(res){
                if(res.code !== 0)
                return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(layerOpen)
                // 调用getAllCate()刷新
                getAllCate()
            }
        })
    })

    // 为编辑按钮绑定点击事件  代理给所有使用了类btn_edit的元素（即所有的编辑按钮）
    $('body').on('click','.btn_edit',function(){
        // e.preventDefault()  不要取消单击的默认事件，否则会造成点击无效！！

        const editCateStr = $('#tplEdit').html()//不是模板，就是普通的script标签
        // 先通过layer弹出页面
        layerEdit = layer.open({
            title:'修改文章分类',
            // 内部内容，是html代码，同样采用模板的方法，拿到.html中的HTML代码
            content:editCateStr,
            // 指定弹出层类型，默认值为0（表示信息框），1-- 代表弹出的是页面层
            type:1,
            area:['500px','250px']
        })

        // 获取点击的是哪个按钮,将该行的内容赋值给弹出页面
        const id = $(this).attr('edit-id')
        // 获取原始数据
        $.ajax({
            method:'get',
            url:'/my/cate/info?id='+ id,
            success:function(res){
                // 将获取到的原始数据渲染到页面
                if(res.code !== 0) return layer.msg(res.massage)
                form.val('editFormLayerFilter',res.data)
            }
        })

        
    })

    // 为编辑按钮监听提交事件
    $('body').on('submit','#editForm',function(e){
        e.preventDefault()

        $.ajax({
            method:'put',
            url:'/my/cate/info',
            data:$(this).serialize(),
            success:function(res){
                // if(res.code !== 0) return layer.msg(res.message)
                layer.msg('修改文章分类成功！') 
                layer.close(layerEdit)
                // 关闭弹出层后刷新页面
                getAllCate()
            }
        })
    })


    // 给删除按钮代理点击事件
    $('body').on('click','.btn_delete',function(){
        // 首先获取被点击的一栏的id
        var id = $(this).attr('delete-id')

        // 会弹出页面，需要layer.confirm
        layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
            // 发起ajax请求删除文章类别
            $.ajax({
                method:'delete',
                url:'/my/cate/del?id=' + id,
                success:function(){
                    layer.msg('删除文章分类成功！')
                    // 刷新
                    getAllCate()
                }
            })
            layer.close(index)
        })
    })
})

// 获取所有类别函数
function getAllCate(){
    // 发起ajax请求
    $.ajax({
        type:'GET',
        url:'/my/cate/list',
        success:function(res){
            if(res.code !== 0)
            return layer.msg(res.message)
            const cateList = res.data
            // 采用模板的方法，获取渲染好的html结构的代码，方便书写
            const cateListHtml = template('teplCateList',cateList)
            // 将html字符串渲染到页面
            $('tbody').html(cateListHtml)
        }
    })
}