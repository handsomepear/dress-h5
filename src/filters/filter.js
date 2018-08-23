export function hideTelNumber(telNumber) {
  var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
  if (reg.test(telNumber)) {
    return telNumber.substring(0, 3) + '****' + telNumber.substring(7)
  }
  return telNumber
}

export function strSlice(start, end) {
  return str.slice(start, end)
}
