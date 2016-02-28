/* jshint strict: true, undef: true */
/* globals spec, spec_throws, _, to_string */

spec(length,        [[1]], 1);
spec(length,        [function () {}], 0);
spec(length,        [function (a) { "use strict"; return a;}], 1);
spec(length,        [{length: 3}], 3);
spec_throws(length, [{}], 'invalid value for l(): {}');

function length(raw_v) {
  "use strict";

  if (raw_v === null || raw_v === undefined || !_.isFinite(raw_v.length))
    throw new Error("Invalid value for length: " + to_string(raw_v));
  return raw_v.length;
}
