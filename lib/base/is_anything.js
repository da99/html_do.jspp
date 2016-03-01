/* jshint strict: true, undef: true */
/* globals spec */
/* globals exports */




spec(is_anything, [false], true);
spec(is_anything, [true], true);
spec(is_anything, [null], new Error('null found'));
spec(is_anything, [undefined], new Error('undefined found'));

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
