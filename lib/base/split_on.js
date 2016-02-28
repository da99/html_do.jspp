/* jshint strict: true, undef: true */
/* globals spec, arguments_are, is_something, is_string, _, is_empty, map_x, is_blank_string */



spec(split_on, [/;/, "a;b;c"], ['a', 'b', 'c']);
spec(split_on, [/;/, "a;b;c"], ['a', 'b', 'c']);
spec(split_on, [/;/, "a; ;c"], ['a', 'c']);

function split_on(pattern, str) {
  "use strict";

  arguments_are(arguments, is_something, is_string);
  var trim = _.trim(str);
  if (is_empty(trim))
    return [];
  return _.compact( map_x(trim.split(pattern), function (x) {
    return !is_blank_string(x) && _.trim(x);
  }));
}
