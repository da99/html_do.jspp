
spec_returns(true, function () { return not(is_something)(null); });
spec_returns(true, function () { return not(length_gt(2), is_null)([1]); });
spec_returns(false, function () { return not(is_something)(1); });
spec_returns(false, function () { return not(is_something, is_null)(1); });
function not() {
  should_be(arguments, length_gt(0));
  var l = arguments.length, funcs = arguments;
  for (var i = 0; i < l; i++) {
    if (!is_function(funcs[i]))
      throw new Error('Not a function: ' + to_string(funcs[i]));
  }

  return function custom_not(val) {
    if (arguments.length !== 1)
      throw new Error('arguments.length !== 1');
    var result;
    for (var i = 0; i < l; i++) {
      result = funcs[i](val);
      if (!is_bool(result))
        throw new Error('Function did not return boolean: ' + to_string(funcs[i]) + ' -> ' + to_string(result));
      if (result)
        return false;
    }
    return true;
  };
}

