/* jshint strict: true, undef: true */
/* globals conditional */
/* globals exports */


exports.or = or;
function or(_funcs) {
  "use strict";

  return conditional('any', arguments);
}
