/* jshint strict: true, undef: true */
/* globals exports */


exports.is_num = is_num;
function is_num(v) {

  return typeof v === 'number' && isFinite(v);
}
