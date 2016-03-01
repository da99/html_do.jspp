/* jshint strict: true, undef: true */
/* globals _, length */


exports.and = and;
function and(_funcs) {
  "use strict";

  var funcs = _.toArray(arguments);
  return function (v) {
    for (var i = 0; i < length(funcs); i++) {
      if (!funcs[i](v))
        return false;
    }
    return true;
  };
}
