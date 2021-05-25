/**
 * ajax请求删除
 * @param id
 * @param url
 */
function del_ajax(id, url) {
    layer.confirm('确认要删除吗？请谨慎操作！！', function () {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                id: id
            },
            success: function (res) {
                if (typeof(res.code) != 'undefined' && res.code == 0) {
                    layer.msg('删除失败！您没有操作权限！', {icon: 2, time: 2000});
                } else {
                    if (res == false) {
                        layer.msg('删除失败！请重新操作！', {icon: 2, time: 2000});
                    }
                    else {
                        layer.msg('成功删除' + res + '条数据', {icon: 1, time: 2000});
                    }
                }
                setTimeout("location.replace(location.href)", 1500);
            }
        });
    });
}

/**
 * ajax请求修改
 * @param action
 * @param data
 * @param field_param
 * @param url
 */
function edit_ajax(url, action = '', id = '', field_param = '', data = '') {
    layer.confirm('确认要修改吗？', function () {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                action: action,
                id: id,     //用于类似修改显示状态
                field_param: field_param,   //用于类似修改显示状态
                data: data, //用于类似修改排序
            },
            success: function (res) {
                layer.msg(res.msg, {icon: res.status ? 1 : 2, time: 2000});
                setTimeout("location.replace(location.href)", 1500);
            }
        });
    });
}

/**
 * 图片预览
 * @param fileDomId
 * @param showDomId
 */
function file_preview(fileDomId, showDomId) {
    //获取input file的files文件数组;
    //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
    //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
    var file = $('#' + fileDomId).get(0).files[0];
//        var name = (file['name']).split('.')[0];
    //创建用来读取此文件的对象
    var reader = new FileReader();
    //使用该对象读取file文件
    reader.readAsDataURL(file);
    //读取文件成功后执行的方法函数
    reader.onload = function (e) {
        //读取成功后返回的一个参数e，整个的一个进度事件
        // console.log(e);
        //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //的base64编码格式的地址
        $('#' + showDomId).get(0).src = e.target.result;
    }
}