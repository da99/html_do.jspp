/* jshint strict: true, undef: true */



function is_$(v) {
  "use strict";

  return v && typeof v.html === 'function' && typeof v.attr === 'function';
}
