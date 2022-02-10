$(function () {
  layui.form.verify({
    title: [/^.{1,30}$/, '文章标题的长度为 1-30 个字符串！']
  })

  let state = null
  $('#btn-pub').on('click', function () {
    state = '已发布'
  })
  $('#btn-save').on('click', function () {
    state = '草稿'
  })

  // 初始化分类列表
  function initArtCate() {
    $.get('/my/cate/list', function (res) {
      // 渲染模板结构
      const htmlStr = template('tmpl-cate', res)
      $('[name="cate_id"]').html(htmlStr)

      // 为编辑器中的 select 设置 lay-ignore 属性
      $('.my-editor select').attr('lay-ignore', '')
      // 重新渲染表单中的下拉菜单
      layui.form.render('select')
      // 隐藏编辑器中的下拉菜单
      $('.my-editor select').css('display', 'none')
    })
  }

  initArtCate()

  // 工具栏的配置项
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike', 'image'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'] // remove formatting button
  ]

  // 创建富文本编辑器
  var quill = new Quill('#editor', {
    // 指定主题
    theme: 'snow',
    // 指定模块
    modules: {
      toolbar: toolbarOptions
    }
  })

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
    viewMode: 2
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  $('.btn-choose-img').on('click', function () {
    $('#file').click()
  })

  $('#file').on('change', function (e) {
    const files = e.target.files
    if (files.length === 0) return

    const imgUrl = URL.createObjectURL(files[0])
    $image.cropper('destroy').attr('src', imgUrl).cropper(options)
  })

  $('.article-form').on('submit', function (e) {
    e.preventDefault()

    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        const fd = new FormData($('.article-form')[0])
        fd.append('content', quill.root.innerHTML)
        fd.append('cover_img', blob)
        fd.append('state', state)

        pubArticle(fd)
      })
  })

  function pubArticle(fd) {
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      processData: false,
      contentType: false,
      data: fd,
      success: function (res) {
        layer.msg(res.message)
        location.href = '/article/art_list.html'
        // 让文章列表被高亮展示
        window.parent.activeArtList()
      }
    })
  }
})
