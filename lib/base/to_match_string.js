/* jshint strict: true, undef: true */
/* globals _, to_string */


exports.to_match_string = to_match_string;
function to_match_string(actual, expect) {
  "use strict";

  if (_.isEqual(actual, expect))
    return to_string(actual) + ' === ' + to_string(expect);
  else
    return to_string(actual) + ' !== ' + to_string(expect);
}
