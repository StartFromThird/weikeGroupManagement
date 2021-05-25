var vue = new Vue();
var Admin  = {
    events: {
        //请求成功的回调
        onAjaxSuccess: function (ret, onAjaxSuccess) {
            var data = typeof ret.data !== 'undefined' ? ret.data : null;
            var msg = typeof ret.msg !== 'undefined' && ret.msg ? ret.msg : '操作成功';
            if (typeof onAjaxSuccess === 'function') {
                var result = onAjaxSuccess.call(this, data, ret);
                if (result === false)
                    return;
            }
            // vue.$notify({
            //     title: '成功',
            //     message: msg,
            //     type: 'success'
            // });

        },
        //请求错误的回调
        onAjaxError: function (ret, onAjaxError) {
            var data = typeof ret.data !== 'undefined' ? ret.data : null;
            if (typeof onAjaxError === 'function') {
                var result = onAjaxError.call(this, data, ret);
                if (result === false) {
                    return;
                }
            }
            vue.$notify({
                title: '请求失败',
                message: ret.msg?ret.msg:ret.data,
                type: 'error'
            });
        },
        //服务器响应数据后
        onAjaxResponse: function (response) {
            try {
                var ret = typeof response === 'object' ? response : JSON.parse(response);
                if (!ret.hasOwnProperty('code')) {
                    $.extend(ret, {code: -2, msg: response, data: null});
                }
            } catch (e) {
                var ret = {code: -1, msg: e.message, data: null};
            }
            return ret;
        }
    },
    api: {
        //发送Ajax请求
        ajax: function (options, success, error) {
            options = typeof options === 'string' ? {url: options} : options;
            var index;
            if (typeof options.loading === 'undefined' || options.loading) {
            }
            options = $.extend({
                type: "POST",
                dataType: "json",
                success: function (ret) {
                    ret = Admin.events.onAjaxResponse(ret);
                    if (ret.code === 0) {
                        Admin.events.onAjaxSuccess(ret, success);
                    } else {
                        Admin.events.onAjaxError(ret, error);
                    }
                },
                error: function (xhr) {
                    var ret = {code: xhr.status, msg: xhr.responseText, data: null};
                    Admin.events.onAjaxError(ret, error);
                }
            }, options);
            return $.ajax(options);
        },
        //修复URL
        fixurl: function (url) {
            if (url.substr(0, 1) !== "/") {
                var r = new RegExp('^(?:[a-z]+:)?//', 'i');
                if (!r.test(url)) {
                    url = Config.moduleurl + "/" + url;
                }
            }
            return url;
        },
        //查询Url参数
        query: function (name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&/]" + name + "([=/]([^&#/?]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        //关闭窗口并回传数据
        close: function (data) {
            var index = parent.Layer.getFrameIndex(window.name);
            var callback = parent.$("#layui-layer" + index).data("callback");
            //再执行关闭
            parent.Layer.close(index);
            //再调用回传函数
            if (typeof callback === 'function') {
                callback.call(undefined, data);
            }
        },
        success: function (options, callback) {
            var type = typeof options === 'function';
            if (type) {
                callback = options;
            }
            return vue.msg('操作成功', $.extend({
                offset: 0, icon: 1
            }, type ? {} : options), callback);
        },
        error: function (options, callback) {
            var type = typeof options === 'function';
            if (type) {
                callback = options;
            }
            return vue.msg('操作成功', $.extend({
                offset: 0, icon: 1
            }, type ? {} : options), callback);
        },
        msg: function (message, url) {
            var callback = typeof url === 'function' ? url : function () {
                if (typeof url !== 'undefined' && url) {
                    location.href = url;
                }
            };
            vue.msg(message, {
                time: 2000
            }, callback);
        },
    },
}