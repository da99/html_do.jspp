/* jshint strict: true, undef: true */
/* globals be, is_enumerable, is_function, _ */
/* globals exports */


exports.map_x = map_x;
function map_x(coll, f) {
  "use strict";

  be(is_enumerable, coll);
  be(is_function,   f);
  return _.map(coll, function (x) { return f(x); });
}
