/* jshint strict: true, undef: true */
/* globals spec, is_string, is_function, is_num, is_something, is_null, _, length, to_string */


spec(be, [1, is_num],    1);
spec(be, [is_num, '1'],  new Error('Value: "1" !== is_num'));
spec(be, [is_string, 2], new Error('Value: 2 !== is_string'));

exports.be = be;
function be(func, val) {
  "use strict";

  switch(length(arguments)) {
    case 2:
      if (!func)
        throw new Error(to_string(val) + ' should be: ' + to_string(func));
      return val;

    case 1:
      be(is_function, func);
      return function (v) {
        return be(func, v);
      };

    default:
      throw new Error("Invalid arguments.");

  }

}

