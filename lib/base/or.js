/* jshint strict: true, undef: true */
/* globals exports, _ */

exports.or = or;
function or(_funcs) {
  "use strict";

  var funcs = _.toArray(arguments);

  return function (v) {
    return !!_.find(funcs, function (f) { return f(v) === true; });
  };
}
