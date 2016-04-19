/* jshint strict: true, undef: true */
/* globals console */
/* globals exports */

exports.log = log;
function log(_args) {

  if (typeof console !== 'undefined' && console.log)
    return console.log.apply(console, arguments);

  return false;
} // === func
