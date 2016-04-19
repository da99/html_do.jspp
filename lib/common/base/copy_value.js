/* jshint strict: true, undef: true */
/* globals spec, arguments_are, is_something, is_boolean, is_array, _, is_plain_object, reduce_eachs, to_string */
/* globals exports, is_arguments, is_function, length, log */


spec({a:{b:"c"}, b:true}, function () { // Does not alter orig.

  var orig = {a:{b:"c"}, b:true};
  var copy = copy_value(orig);
  copy.a.b = "1";
  return orig;
});

spec(copy_value, [[1, copy_value], is_function], [1, copy_value]);

exports.copy_value = copy_value;
function copy_value(v) {

  var allow_these = [];

  if (length(arguments) < 2) {
    arguments_are(arguments, is_something);
  } else {
    allow_these = _.toArray(arguments).slice(1);
  }

  var type = typeof v;
  if (type === 'string' || type === 'number' || is_boolean(v))
    return v;

  if (is_array(v))
    return _.map(v, function (new_v) { return copy_value.apply(null, [new_v].concat(allow_these)); });

  if (is_plain_object(v))
    return reduce_eachs({}, v, function (acc, kx, x) {
      acc[kx] = copy_value.apply(null, [x].concat(allow_these));
      return acc;
    });

  var return_val = _.find(allow_these, function (f) { return f(v); });
  if (return_val)
    return v;

  return v;
  // throw new Error('Value can\'t be copied: ' + to_string(v));
}
