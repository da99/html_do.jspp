/* jshint strict: true, undef: true */
/* globals _ */
/* globals exports */

exports.is_plain_object = is_plain_object;
function is_plain_object(v) {
  "use strict";

  return _.isPlainObject(v);
}