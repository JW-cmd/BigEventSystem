// 获取文章列表所需要的参数对象有四个属性：
    // pagenum: 1, // 页码值
    // pagesize: 2, // 每页显示几条数据
    // cate_id: '', // 分类 id
    // state: '' // 发布状态

// 先定义一个全局参数对象，方便筛选或分页时改变其值，使获取的数据不一样
let reqObj = {
    pagenum: 1, // 页码值(必)，默认显示第一页
    pagesize: 2, // 每页显示几条数据（必），默认每页显示两条数据
    cate_id: '', // 分类 id
    state: '' // 发布状态
}

const layer = layui.layer
const form = layui.form
var laypage = layui.laypage

$(function(){
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        const dt = new Date(dtStr)
    
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1).toString().padStart(2, '0')
        const d = dt.getDate().toString().padStart(2, '0')
    
        const hh = dt.getHours().toString().padStart(2, '0')
        const mm = dt.getHours().toString().padStart(2, '0')
        const ss = dt.getSeconds().toString().padStart(2, '0')
    
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
      }

    //   调用渲染表格的方法
    renderArtList()
    // 调用渲染筛选区域的方法
    randerSelect ()

    // 监听筛选按钮提交事件
    $('body').on('submit','.layui-form-flex',function(e){
        e.preventDefault()
        // 获取用户选择的内容，发起ajax请求重新渲染表格
        reqObj.cate_id = $('[name = cate_id]').val()
        reqObj.state = $('[name = state]').val()

        // 重新渲染
        renderArtList()
    })

    // 监听筛选按钮的重置事件  重置后表格刷新
    $('body').on('click','[type = reset]',function(){
        // 将要向后端发送的数据对象重置即可
        reqObj = {
            pagenum: 1, // 页码值(必)，默认显示第一页
            pagesize: 2, // 每页显示几条数据（必），默认每页显示两条数据
            cate_id: '', // 分类 id
            state: '' // 发布状态
        }
        // 重新渲染
        renderArtList()
    })

    
    

})

function renderArtList(){
    // 发起ajax请求渲染表格数据
    $.ajax({
        method:'get',
        url:'/my/article/list',
        data:reqObj,
        success:function(res){
            if(res.code !== 0) return layer.msg(res.message)

            // 调用模板引擎，渲染表格数据
            let tableTmplStr = template('renderTable',res.data)
            $('#artListTbody').html(tableTmplStr)

            // 列表渲染完成后，渲染分页区域
            renderPage(res.total)
        }
    })

    
}

// 筛选区域 ---- 选择文章类别
function randerSelect (){
    $.ajax({
        method:'get',
        url:'/my/cate/list',
        success:function(res){
            if(res.code !== 0) return layer.msg(res.message)
            // 渲染表单数据
            // 通过模板拿到渲染好的html结构
            const selectCateStr = template('tmplSelect',res.data)
            // 将html注入所需标签内
            $('.layui-input-block [name = cate_id]').html(selectCateStr)
            // 调用layui提供的form对象的render方法重新渲染
            form.render('select')
        }
    })
}

// 分页区域  通过laypage渲染分页区域
function renderPage(total){
    laypage.render({
        elem:'laypageBox',
        count:total,
        curr:reqObj.pagenum,
        limit:reqObj.pagesize,
        limits:[2,3,5,10],
        layout:['count','limit','prev','page','next','skip'],

        // 回调函数，每次调用render方法或者选择分页、option时会自动触发
        jump:function(obj,first){
            // 获取用户点击的最新数据
            reqObj.pagenum = obj.curr
            reqObj.pagesize = obj.limit

            // 排除调用render方法产生的触发
            if(!first){
                // 重新渲染
                renderArtList()
            }
        }
    })
}

// 为删除按钮绑定点击事件
$('body').on('click','.btn-delete',function(){
    // 获取删除按钮
    const id = $(this).attr('data-id')

    // 点击后弹出提示页面
    layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
        
        // 发起ajax请求，删除一条文章
        $.ajax({
            method:'delete',
            url:'/my/article/info?id=' + id,
            success:function(res){
                if(res.code !== 0) return layer.msg(res.message)
                // 刷新页面 但是会存在问题，当最后一页的数据删完后，页面的页码会减1，
                // 但是我们发送过去的数据对象的页码值还是原来的页面，所以后端会返回返回没有数据的页面，
                // 故应该将参数对象的页码值在这种情况下也要减1

                // 获取页面中删除按钮的个数
                let deleteTotal = $('.btn-delete').length
                // 当页面只有一个删除按钮时，页面只有一行数据了，再删除就要将页码值减一
                if(deleteTotal === 1 && reqObj.pagenum>1){
                    reqObj.pagenum--
                }
                renderArtList()
            }
        })
        layer.close(index);//layui自带的弹出层序号
    });

})

// 为文章标题的链接添加点击事件处理函数
$('tbody').on('click', '.link-title', function () {
    // 获取文章的 id
    const id = $(this).attr('data-id')
    // 请求文章的数据
    $.get('/my/article/info', { id }, function (res) {
      console.log(res)
      const htmlStr = template('tmpl-artinfo', res.data)
      layer.open({
        type: 1,
        title: '预览文章',
        area: ['80%', '80%'],
        content: htmlStr
      })
    })
  })

  // 编辑文章按钮的点击事件处理函数
  $('tbody').on('click', '.btn-edit', function () {
    // 获取要编辑的文章的 id
    const id = $(this).attr('data-id')
    // 跳转到文章编辑页面
    location.href = '/article/art_edit.html?id=' + id
  })