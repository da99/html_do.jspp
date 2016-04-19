/* jshint strict: true, undef: true */
/* globals exports */

exports.to_arg = to_arg;

/*
 * Returns the arguments passed to it as an arguments object:
 * to_arguments(1,2,3) -> non-array, arguments: [1,2,3]
 * to_arguments("a", "b", "c") -> non-array, arguments: ["a", "b", "c"]
 */
function to_arguments() {
  return arguments;
}
