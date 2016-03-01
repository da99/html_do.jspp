/* jshint strict: true, undef: true */
/* globals spec_returns, is_function, spec_throws, arguments_are, is_something, to_string */


spec_returns(true, function has_length_returns_function() {
  "use strict";
  return is_function(has_length(1));
});

spec_returns(true, function has_length_returns_function_comparing_length() {
  "use strict";
  return has_length(1)([1]);
});

spec_returns(true, function has_length_returns_function_comparing_length_of_function() {
  "use strict";
  return has_length(2)(function (a,b) {});
});

spec_throws(function () { // returns function that returns false on length mismatch
  "use strict";
  return has_length(3)([1,2]);
}, [], "[1, 2].length !== 3");

exports.has_length = has_length;
function has_length(num) {
  "use strict";

  return function _has_length_(val) {
    arguments_are(arguments, is_something);
    if (val.length === num)
      return true;
    throw new Error(to_string(val) + '.length !== ' + to_string(num));
  };
}
