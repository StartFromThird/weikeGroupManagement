function getPositionForTextArea(ctrl) {
  let CaretPos = 0
  if (ctrl.selectionStart || ctrl.selectionStart === '0') {
    // Firefox support
    CaretPos = ctrl.selectionStart
  }
  return CaretPos
}

// 设置光标位置
function setCaretPosition(ctrl, pos) {
  if (ctrl.setSelectionRange) {
    ctrl.focus()
    ctrl.setSelectionRange(pos, pos)
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
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
