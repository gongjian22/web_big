// 每次调用$.get(),$.post(),$.ajax()的时候，会先调用ajaxPrefilter这个函数，此函数可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {

    //在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);

    //统一为有权限的接口设置headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

})