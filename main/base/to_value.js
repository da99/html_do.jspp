

spec_returns('"4"', function to_value_returns_a_value() {
  return to_value(4, to_string, to_string);
});
spec_returns(5, function to_value_returns_first_value_if_no_funcs() {
  return to_value(5);
});
function to_value(val, _funcs) {
  should_be(val, is_something);
  should_be(arguments, not(is_empty));

  var i = 1, l = arguments.length;
  while (i < l) {
    val = arguments[i](val);
    i = i + 1;
  }
  return val;
}
