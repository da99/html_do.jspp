/* jshint strict: true, undef: true */
/* globals spec, _, is_arguments, is_plain_object, is_function */
/* globals exports, log */



spec(to_array, [[1,2,3]], [1,2,3]);
spec(to_array, [to_arguments(1,2,3)], [1,2,3]);
spec(to_array, [1,2,3], /Invalid value for /);

exports.to_array = to_array;

function to_array(val) {
  if (!_.isArray(val) && val.constructor != arguments.constructor)
    throw new Error("Invalid value for to_array: " + to_string(val));

  return _.toArray(val);
} // === func

