/* jshint strict: true, undef: true */
/* globals _, and */

function find(_funcs) {
  "use strict";

  var funcs = _.toArray(arguments);

  return function (v) {
    return _.find(v, and.apply(null, funcs));
  };
}
