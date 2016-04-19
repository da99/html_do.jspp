/* jshint strict: true, undef: true */
/* globals spec, arguments_are, is_something, is_string, _, is_empty, map_x, is_blank_string */
/* globals exports */



spec(split_on, [/;/, "a;b;c"], ['a', 'b', 'c']);
spec(split_on, [/;/, "a;b;c"], ['a', 'b', 'c']);
spec(split_on, [/;/, "a; ;c"], ['a', 'c']);
spec(split_on('.'), ['form.id'], ['form', 'id']);

exports.split_on = split_on;
function split_on(pattern, str) {

  function _split_on_(str) {
    return split_on(pattern, str);
  }

  if (length(arguments) === 1)
    return _split_on_;

  arguments_are(arguments, is_something, is_string);
  var trim = _.trim(str);
  if (is_empty(trim))
    return [];
  return _.compact( map_x(trim.split(pattern), function (x) {
    return !is_blank_string(x) && _.trim(x);
  }));
}
