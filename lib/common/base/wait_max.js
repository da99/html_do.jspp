/* jshint strict: true, undef: true */
/* globals to_string, setTimeout */
/* globals exports, spec */

spec(5, function stops_on_return_true(fin) {
  "use strict";
  var i = 0;
  wait_max(2, function () {
    i = i + 1;
    if (i === 5) {
      fin(i);
      return true;
    }
    return false;
  });
});

exports.wait_max = wait_max;
function wait_max(seconds, func) {
  "use strict";

  var ms       = seconds * 1000;
  var total    = 0;
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
