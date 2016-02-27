


spec(be, [1, is_num], 1);
spec(be, [1, is_num, is_something], 1);
spec(be, ['1', is_num], new Error('Value: "1" !== is_num'));
spec(be, [2, is_num, is_null], new Error('Value: 2 !== is_null'));
function be() {
  var funcs = _.toArray(arguments);
  return function (v) {
    for (var i = 0; i < length(funcs); i++) {
      if (!funcs[i](v))
        throw new Error(to_string(v) + ' should be: ' + to_string(funcs[i]));
    }
    return v;
  };
}
