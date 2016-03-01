/* jshint strict: true, undef: true */
/* globals _, length, to_string, function_to_name, log, spec_new, spec_push, to_match_string */
/* globals exports */


// Specification function:
exports.spec_returns = spec_returns;
function spec_returns(expect, f) {
  "use strict";

  if (!spec_new(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  if (length(f) === 0) {
    spec_push(function () {
      var sig = function_to_name(f);
      var actual = f();
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    });
    return;
  } // if f.length === 0

  // === Async func:
  spec_push(function (fin) {
    var sig = function_to_name(f);
    f(function (actual) {
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      fin();
      return true;
    });
  });
} // === spec_returns
