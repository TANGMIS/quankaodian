layui.config({
    base: '/pc/webapp/ke/lib/layui/extends/'
}).extend({
   
});

layui.use(['jquery', 'form', 'element', 'layer'], function () {

    var $ = layui.jquery;
    var form = layui.form;
    var layer = layui.layer;
    var helper = layui.helper;

    var $token = $('meta[name="csrf-token"]');

    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Csrf-Token', $token.attr('content'));
        },
        statusCode: {
            400: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                layer.msg(res.msg, {icon: 2, anim: 6});
            },
            401: function () {
                layer.msg('操作之前请先登录', {icon: 2, anim: 6});
            },
            403: function () {
                layer.msg('操作受限', {icon: 2, anim: 6});
            },
            404: function () {
                layer.msg('资源不存在', {icon: 2, anim: 6});
            },
            500: function () {
                layer.msg('服务器内部错误', {icon: 2, anim: 6});
            }
        }
    });

    setInterval(function () {
        $.ajax({
            type: 'POST',
            url: '/token/refresh',
            success: function (res) {
                $token.attr('content', res.token);
            }
        });
    }, 300000);

    form.on('submit(go)', function (data) {
        var submit = $(this);
        submit.attr('disabled', 'disabled').addClass('layui-btn-disabled');
        $.ajax({
            type: 'POST',
            url: data.form.action,
            data: data.field,
            success: function (res) {
                var icon = res.code === 0 ? 1 : 2;
                if (res.msg) {
                    layer.msg(res.msg, {icon: icon});
                }
                if (res.location) {
                    var target = res.target || 'self';
                    setTimeout(function () {
                        if (target === 'parent') {
                            parent.location.href = res.location;
                        } else {
                            window.location.href = res.location;
                        }
                    }, 1500);
                } else {
                    submit.removeAttr('disabled').removeClass('layui-btn-disabled');
                }
            },
            error: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                layer.msg(res.msg, {icon: 2});
                submit.removeAttr('disabled').removeClass('layui-btn-disabled');
            }
        });
        return false;
    });

    $('.kg-delete').on('click', function () {
        var url = $(this).data('url');
        var tips = $(this).data('tips');
        tips = tips || '确定要删除吗？';
        layer.confirm(tips, function () {
            $.ajax({
                type: 'POST',
                url: url,
                success: function (res) {
                    layer.msg(res.msg, {icon: 1});
                    if (res.location) {
                        setTimeout(function () {
                            window.location.href = res.location;
                        }, 1500);
                    } else {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }
                }
            });
        });
    });

    $('.kg-back').on('click', function () {
        window.history.back();
    });

    $('.nav-search').on('click', function () {
        var content = '<form action="' + $(this).data('url') + '">';
        content += '<input type="text" name="query" autocomplete="off" placeholder="搜索内容，回车跳转">';
        content += '<input type="hidden" name="type" value="' + $(this).data('type') + '">';
        content += '</form>';
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            shadeClose: true,
            offset: '120px',
            maxWidth: 10000,
            skin: 'layer-search',
            content: content,
            success: function (dom) {
                var form = dom.find('form');
                var query = dom.find('input[name=query]');
                query.focus();
                $(form).submit(function () {
                    if (query.val().replace(/\s/g, '') === '') {
                        return false;
                    }
                });
            }
        });
    });

    $('body').on('click', '.layui-laypage > a', function () {
        var url = $(this).data('url');
        var target = $(this).data('target');
        if (url.length > 0 && target.length > 0) {
            helper.ajaxLoadHtml(url, target);
        }
    });

});