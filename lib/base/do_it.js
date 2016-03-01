/* jshint strict: true, undef: true */
/* globals arguments_are, is_positive, is_function */
/* globals exports */


exports.do_it = do_it;
function do_it(num, func) {
  "use strict";

  arguments_are(arguments, is_positive, is_function);
  for (var i = 0; i < num; i++) {
    func();
  }
  return true;
}
