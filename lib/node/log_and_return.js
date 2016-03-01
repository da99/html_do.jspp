/* jshint esnext: true, strict: true, undef: true */
/* globals log */

exports.log_and_return = log_and_return;
function log_and_return(v) {
  "use strict";
  log(v);
  return v;
}
