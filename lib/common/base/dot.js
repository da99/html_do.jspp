/* jshint strict: true, undef: true */
/* globals spec, identity, _, is_undefined, to_string, be, is_function */
/* globals exports, log, to_function */


spec(dot('num'),    [{num: 3}],         3);
spec(dot('html()'), [{html: to_function('hyper')}], 'hyper');
spec(dot('num'),    [{n:4}],            new Error('Property not found: "num" in {"n":4}'));

exports.dot = dot;
function dot(raw_name) {
  "use strict";

  var name = _.trimEnd(raw_name, '()');

  return function _dot_(o) {
    if (is_undefined(o[name]))
      throw new Error('Property not found: ' + to_string(name) + ' in ' + to_string(o));

    if (name !== raw_name) {
      log(name, raw_name, o);
      be(is_function, o[name]);
      return o[name]();
    } else
      return o[name];
  };
} // === func dot
