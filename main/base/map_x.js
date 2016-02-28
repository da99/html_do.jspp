/* jshint strict: true, undef: true */
/* globals be, is_enumerable, is_function, _ */


function map_x(coll, f) {
  "use strict";

  be(is_enumerable, coll);
  be(is_function,   f);
  return _.map(coll, function (x) { return f(x); });
}
