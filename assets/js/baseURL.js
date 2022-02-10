// 这是一个专门放根路经的js文件
    // 设置url默认根路径    options是形参，值时每一次调用它的请求
    $.ajaxPrefilter(function(options){
        options.url = 'http://www.liulongbin.top:3008'+options.url
    
        // 统一设置有权限的接口的headers请求头
         const tokenStr = localStorage.getItem('token');
         
        if(options.url.indexOf('/my/')!==-1 && tokenStr){
            options.headers={
                Authorization: tokenStr
            }
        }
        
    })

    
