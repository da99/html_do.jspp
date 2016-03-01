/* jshint strict: true, undef: true */
/* globals spec_returns, arguments_are, is_something, is_boolean, is_array, _, is_plain_object, reduce_eachs, to_string */


spec_returns({a:{b:"c"}, b:true}, function () { // Does not alter orig.
  "use strict";

  var orig = {a:{b:"c"}, b:true};
  var copy = copy_value(orig);
  copy.a.b = "1";
  return orig;
});

exports.copy_value = copy_value;
function copy_value(v) {
  "use strict";

  arguments_are(arguments, is_something);
  var type = typeof v;
  if (type === 'string' || type === 'number' || is_boolean(v))
    return v;

  if (is_array(v))
    return _.map(v, function (v) { return copy_value(v); });

  if (is_plain_object(v))
    return reduce_eachs({}, v, function (acc, kx, x) {
      acc[kx] = copy_value(x);
      return acc;
    });

  throw new Error('Value can\'t be copied: ' + to_string(v));
}
