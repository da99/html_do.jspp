/* jshint strict: true, undef: true */
/* globals spec, _, to_string */
/* globals exports */

spec(length,        [[1]], 1);
spec(length,        [function () {}], 0);
spec(length,        [function (a) { return a;}], 1);
spec(length,        [{length: 3}], 3);
spec(length, [3],  new Error('Invalid value for length: 3'));

exports.length = length;
function length(raw_v) {

  if (raw_v === null || raw_v === undefined || !_.isFinite(raw_v.length))
    throw new Error("Invalid value for length: " + to_string(raw_v));
  return raw_v.length;
}
