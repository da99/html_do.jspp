/* jshint strict: true, undef: true */
/* globals spec, to_string, or, is_null, is_undefined */


spec(is_nothing, [null],      true);
spec(is_nothing, [undefined], true);
spec(is_nothing, [[]],       false);
spec(is_nothing, [{}],       false);
spec(is_nothing, [{a: "c"}], false);

exports.is_nothing = is_nothing;
function is_nothing(v) {
  "use strict";

  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));

  return or(is_null, is_undefined)(v);
}
