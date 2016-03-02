/* jshint strict: true, undef: true */
/* globals spec, return_arguments, _, to_string */
/* globals exports, log */

spec(is_empty, [[]], true);
spec(is_empty, [{}], true);
spec(is_empty, [""], true);
spec(is_empty, [{a: "c"}], false);
spec(is_empty, [[1]],      false);
spec(is_empty, ["a"],      false);
spec(is_empty, [return_arguments()],      true);
spec(is_empty, [return_arguments(1,2,3)], false);
spec(is_empty, [null], new Error('invalid value: null'));
spec(is_empty, [undefined], new Error('invalid value: undefined'));

exports.is_empty = is_empty;
function is_empty(v) {
  "use strict";

  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));

  if ( v === null )
    throw new Error("invalid value: null");
  if ( v === undefined)
    throw new Error("invalid value: undefined");

  if (_.isPlainObject(v))
    return _.keys(v).length === 0;

  var l = v.length;
  if (!_.isFinite(l))
    throw new Error("!!! Invalid .length property.");

  return l === 0;
} // === func
