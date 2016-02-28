/* jshint strict: true, undef: true */
/* globals conditional */


function or(_funcs) {
  "use strict";

  return conditional('any', arguments);
}
