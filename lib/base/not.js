/* jshint strict: true, undef: true */
/* globals spec_returns, is_something, reduce, length, length_gt, is_something, to_string, is_function, is_null */
/* globals be, is_boolean, is */

spec_returns(true, function () { "use strict"; return not(is_something)(null); });
spec_returns(true, function () { "use strict"; return not(length_gt(2), is_null)([1]); });
spec_returns(false, function () { "use strict"; return not(is_something)(1); });
spec_returns(false, function () { "use strict"; return not(is_something, is_null)(1); });

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
