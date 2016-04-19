/* jshint strict: true, undef: true */
/* globals spec, to_string */
/* globals exports */

spec(is_something, [null],      false);
spec(is_something, [undefined], false);
spec(is_something, [[]],       true);
spec(is_something, [{}],       true);
spec(is_something, [{a: "c"}], true);

exports.is_something = is_something;
function is_something(v) {

  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));
  return v !== null && v !== undefined;
}
