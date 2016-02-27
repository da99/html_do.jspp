
spec_returns(true, function () { return not(is_something)(null); });
spec_returns(true, function () { return not(length_gt(2), is_null)([1]); });
spec_returns(false, function () { return not(is_something)(1); });
spec_returns(false, function () { return not(is_something, is_null)(1); });
function not(func) {
  reduce(arguments, length, be(is(1)));
  var l = arguments.length, funcs = arguments;
  if (!is_function(func))
    throw new Error('Not a function: ' + to_string(func));

  return function _not_(val) {
    if (arguments.length !== 1)
      throw new Error('arguments.length !== 1');
    var result = func(val);
    if (!is_boolean(result))
      throw new Error('Function did not return boolean: ' + to_string(funcs[i]) + ' -> ' + to_string(result));
    return !result;
  };
}

