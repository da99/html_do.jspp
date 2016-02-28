/* jshint strict: true, undef: true */


function is_num(v) {
  "use strict";

  return typeof v === 'number' && isFinite(v);
}
