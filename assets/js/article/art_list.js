$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认第一页
        pagesize: 2, //每页显示几条数据，默认显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }

    initTable()
    initCate()
        //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
                    //通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单中选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            //为查询对象q中对应的属性值赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的q，重新渲染表格数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //id选择器这里不能加#
            count: total, //总数据条数
            limit: q.pagesize, //每页有几条数据
            curr: q.pagenum, //默认被选中的页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                //1.分页发生切换到时候，出发jump回调 2.只要调用了laypage.render方法，就会出发jump回调
                console.log(obj.curr);
                //把最新的条目数，赋值到q.pagesize属性
                q.pagesize = obj.limit
                    //把最新的页码值赋值到q
                q.pagenum = obj.curr
                if (!first) {
                    initTable()
                }

            }
        })

    }

    //通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
            //获取文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }

            })
            layer.close(index)
        })

    })
})