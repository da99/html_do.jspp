/* jshint strict: true, undef: true */
/* globals spec, is_num, is_empty */


spec(false, function () { // next_id returns a different value than previous
  "use strict";

  return next_id() === next_id();
});

function next_id() {
  "use strict";

  if (!is_num(next_id.count))
    next_id.count = -1;
  next_id.count = next_id.count + 1;
  if (is_empty(arguments))
    return next_id.count;
  return arguments[0] + '_' + next_id.count;
}
