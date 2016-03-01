/* jshint strict: true, undef: true */
/* globals _ */
/* globals exports */

exports.is_array = is_array;
function is_array(v) {
  "use strict";

  return _.isArray(v);
}
