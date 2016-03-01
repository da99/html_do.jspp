/* jshint strict: true, undef: true */
/* globals spec, spec_throws */




spec(is_anything, [false], true);
spec(is_anything, [true], true);
spec_throws(is_anything, [null], 'null found');
spec_throws(is_anything, [undefined], 'undefined found');

exports.is_anything = is_anything;
function is_anything(v) {
  "use strict";

  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  if (v === null)
    throw new Error("'null' found.");
  if (v === undefined)
    throw new Error("'undefined' found.");

  return true;
}
