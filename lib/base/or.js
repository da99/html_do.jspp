/* jshint strict: true, undef: true */
/* globals conditional */


exports.or = or;
function or(_funcs) {
  "use strict";

  return conditional('any', arguments);
}
