/* jshint strict: true, undef: true */
/* globals spec_returns, be, is_something, to_string, not, is_empty */
/* globals exports */


spec_returns('"4"', function to_value_returns_a_value() {
  "use strict";

  return to_value(4, to_string, to_string);
});

spec_returns(5, function to_value_returns_first_value_if_no_funcs() {
  "use strict";

  return to_value(5);
});

exports.to_value = to_value;
function to_value(val, _funcs) {
  "use strict";

  be(is_something, val);
  be(not(is_empty), arguments);

  var i = 1, l = arguments.length;
  while (i < l) {
    val = arguments[i](val);
    i = i + 1;
  }
  return val;
}
