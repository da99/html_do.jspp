

function spec(_args) {
  let f, args, expect;

  if (arguments.length === 3) {
    f      = arguments[0];
    args   = arguments[1];
    expect = arguments[2];

    return spec_push(function () {
      var sig    = to_function_string(f, args);
      var actual = f.apply(null, args);
      var msg    = to_match_string(actual, expect);

      if (actual !== expect && !_.isEqual(actual, expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg );

      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    });
  }

  if (arguments.length === 2) {
    expect = arguments[0];
    f = arguments[1];

    return spec_push(function () {
      var sig = function_to_name(f);
      var actual = f();
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    });
  }
} // === function spec
