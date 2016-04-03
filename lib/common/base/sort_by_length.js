/* jshint strict: true, undef: true */
/* globals length */
/* globals exports */




exports.sort_by_length = sort_by_length;
function sort_by_length(arr) {
  "use strict";

  return arr.sort(function (a,b) {
    return length(a) - length(b);
  });
}
