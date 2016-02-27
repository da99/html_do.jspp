

// Specification function:
function spec(f, args, expect) {
  if (!spec_new(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  if (arguments.length !== 3)
    throw new Error("arguments.length invalid for spec: " + to_string(arguments.length));

  spec_push(function () {
    var sig    = to_function_string(f, args);
    var actual = f.apply(null, args);
    var msg    = to_match_string(actual, expect);

    if (actual !== expect && !_.isEqual(actual, expect))
      throw new Error("!!! Failed: " + sig + ' -> ' + msg );

    log('=== Passed: ' + sig + ' -> ' + msg);
    return true;
  });
}
