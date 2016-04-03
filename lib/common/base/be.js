/* jshint strict: true, undef: true */
/* globals spec, is_string, is_function, is_num, is_something, is_null, _, length, to_string */
/* globals exports */


spec(be, [is_num, 1],    1);
spec(be, [is_num, '1'],  /"1" should be: is_num/);
spec(be, [is_string, 2], /2 should be: is_string/);

exports.be = be;
function be(func, val) {
  "use strict";

  switch(length(arguments)) {
    case 2:
      if (!func(val))
        throw new Error(to_string(val) + ' should be: ' + to_string(func));
      return val;

    case 1:
      be(is_function, func);
      return function (v) {
        return be(func, v);
      };
  }

  throw new Error("Invalid arguments.");
}

