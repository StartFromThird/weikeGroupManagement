function getPositionForTextArea(ctrl) {
  let CaretPos = 0;
  if (ctrl.selectionStart || ctrl.selectionStart === "0") {
    // Firefox support
    CaretPos = ctrl.selectionStart;
  }
  return CaretPos;
}

// 设置光标位置
function setCaretPosition(ctrl, pos) {
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}

// 非 router 查询参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
// 字节数计算
/**
 * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
 * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
 * 
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF 
   00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
  * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
  * 
  * 注: Unicode在范围 D800-DFFF 中不存在任何字符
  * {@link http://zh.wikipedia.org/wiki/UTF-8}
  * 
  * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
  * 000000 - 00FFFF  两个字节
  * 010000 - 10FFFF  四个字节
  * 
  * {@link http://zh.wikipedia.org/wiki/UTF-16}
  * @param  {String} str 
  * @param  {String} charset utf-8, utf-16
  * @return {Number}
  */
function getByteLen(str, charset) {
  if (!str) {
    return 0;
  }
  var total = 0,
    charCode,
    i,
    len;
  charset = charset ? charset.toLowerCase() : "";
  if (charset === "utf-16" || charset === "utf16") {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0xffff) {
        total += 2;
      } else {
        total += 4;
      }
    }
  } else {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
      }
    }
  }
  return total;
}
// 简单下载
function simplyDownload(downloadUrl, fileName) {
  var link = document.createElement("a");
  link.download = fileName;
  link.style.display = "none";
  link.href = downloadUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// 一键复制粘贴
function copyTxt(txt, actClass, targetSelector) {
  return new Promise((res, rej) => {
    var clipboard = new ClipboardJS(actClass, {
      target: function () {
        return document.querySelector(targetSelector);
      },
    });
    clipboard.on("success", function (e) {
      res(true);
    });
    clipboard.on("error", function (e) {
      console.log("复制失败", e);
      res(false);
    });
  });
}
/* 通过文字二进制得到文字字节数 */
function getByteByBinary(binaryCode) {
  /**
   * 二进制 Binary system,es6表示时以0b开头
   * 八进制 Octal number system,es5表示时以0开头,es6表示时以0o开头
   * 十进制 Decimal system
   * 十六进制 Hexadecimal,es5、es6表示时以0x开头
   */
  var byteLengthDatas = [0, 1, 2, 3, 4];
  var len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
  return len;
}
// 通过文字十六进制得到文字字节数
function getByteByHex(hexCode) {
  return getByteByBinary(parseInt(hexCode, 16).toString(2));
}
// 截断emoji
function substringByByte3(str, maxLength) {
  var result = "";
  var flag = false;
  var len = 0;
  var length = 0;
  var length2 = 0;
  for (var i = 0; i < str.length; i++) {
    var code = str.codePointAt(i).toString(16);
    if (code.length > 4) {
      i++;
      if (i + 1 < str.length) {
        flag = str.codePointAt(i + 1).toString(16) == "200d";
      }
    }
    if (flag) {
      len += getByteByHex(code);
      if (i == str.length - 1) {
        length += len;
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
        } else {
          break;
        }
      }
    } else {
      if (len != 0) {
        length += len;
        length += getByteByHex(code);
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
          length2 = i + 1;
        } else {
          break;
        }
        len = 0;
        continue;
      }
      length += getByteByHex(code);
      if (length <= maxLength) {
        if (code.length <= 4) {
          result += str[i];
        } else {
          result += str[i - 1] + str[i];
        }
        length2 = i + 1;
      } else {
        break;
      }
    }
  }
  return result;
}
