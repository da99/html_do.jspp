
spec(should_be, [1, is_num], 1);
spec(should_be, [1, is_num, is_something], 1);
spec_throws( should_be, ['1', is_num], 'Value: "1" !== is_num');
spec_throws( should_be, [2, is_num, is_null], 'Value: 2 !== is_null');
function should_be(val, _funcs) {
  if (arguments.length < 2)
    throw new Error('Not enough arguments: ' + to_string(arguments));
  var funcs = _.toArray(arguments).slice(1);
  var l = funcs.length, result;
  for (var i = 0; i < l; i++) {
    result = funcs[i](val);
    if (!is_bool(result))
      throw new Error('Return value  not a boolean: ' + to_string(result) + ' <- ' + to_string(funcs[i]) + '(' + to_string(val) + ')');
    if (!result)
      throw new Error('Value: ' + to_string(val) + ' !== ' + function_to_name(funcs[i]));
  }

  return val;
}
