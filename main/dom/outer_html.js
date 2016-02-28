/* jshint strict: true, undef: true */
/* globals $ */


function outer_html(raw) {
  "use strict";

  return raw.map(function () {
    return $(this).prop('outerHTML');
  }).toArray().join('');
}
