/* jshint strict: true, undef: true */
/* globals spec, identity, _, is_undefined, to_string, be, is_function */


spec(dot('num'),    [{num: 3}],                  3);
spec(dot('html()'), [{html: identity('hyper')}], 'hyper');
spec(dot('num'),    [{n:4}],                     new Error('Property not found: "num" in {"n":4}'));

function dot(raw_name) {
  "use strict";

  var name = _.trimRight(raw_name, '()');

  return function _dot_(o) {
    if (is_undefined(o[name]))
      throw new Error('Property not found: ' + to_string(name) + ' in ' + to_string(o));

    if (name !== raw_name) {
      be(is_function, o[name]);
      return o[name]();
    } else
      return o[name];
  };
} // === func dot
