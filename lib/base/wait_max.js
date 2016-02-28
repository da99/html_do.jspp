/* jshint strict: true, undef: true */
/* globals to_string, setTimeout */


function wait_max(seconds, func) {
  "use strict";

  var ms = seconds * 1000;
  var total = 0;
  var interval = 100;
  function reloop() {
    total = total + interval;
    if (func())
      return true;
    if (total > ms)
      throw new Error('Timeout exceeded: ' + to_string(func) );
    else
      setTimeout(reloop, interval);
  }
  setTimeout(reloop, interval);
}
