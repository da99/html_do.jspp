/* jshint strict: true, undef: true */
/* globals spec, is_something, reduce, length, length_gt, is_something, to_string, is_function, is_null */
/* globals be, is_boolean, is */
/* globals exports */

spec(true, function () { "use strict"; return not(is_something)(null); });
spec(true, function () { "use strict"; return not(length_gt(2))([1]); });
spec(false, function () { "use strict"; return not(is_something)(1); });
spec(false, function () { "use strict"; return not(is(1))(1); });
spec(not, [is_something, is_null], /should be/);

exports.not = not;
function not(func) {
  "use strict";

  reduce(arguments, length, be(is(1)));
  var l = arguments.length;
  if (!is_function(func))
    throw new Error('Not a function: ' + to_string(func));

  return function _not_(val) {
    if (arguments.length !== 1)
      throw new Error('arguments.length !== 1');
    var result = func(val);
    if (!is_boolean(result))
      throw new Error('Function did not return boolean: ' + to_string(func) + ' -> ' + to_string(result));
    return !result;
  };
}
