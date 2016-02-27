

// Specification function:
function spec_throws(f, args, expect) {
  if (!spec_new(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));
  if (!_.isArray(args))
    throw new Error('Invalid value for args: ' + to_string(args));
  if (!_.isString(expect))
    throw new Error('Invalid valie for expect: ' + to_string(expect));

  spec_push(function () {
    var actual, err;
    var sig = to_function_string(f, args);

    try {
      f.apply(null, args);
    } catch (e) {
      err = e;
      actual = e.message;
    }

    var msg = to_match_string(actual, expect);

    if (!actual)
      throw new Error('!!! Failed to throw error: ' + sig + ' -> ' + expect);

    if (_.isEqual(actual, expect)) {
      log('=== Passed: ' + sig + ' -> ' + expect);
      return true;
    }

    log(err);
    throw new Error('Error message does not match: ' + to_string(actual) + ' !== ' + to_string(expect) );
  });
} // === function spec_throws
