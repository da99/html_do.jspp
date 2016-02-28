/* jshint strict: true, undef: true */
/* globals console */

function log(_args) {
  "use strict";

  if (typeof console !== 'undefined' && console.log)
    return console.log.apply(console, arguments);

  return false;
} // === func
