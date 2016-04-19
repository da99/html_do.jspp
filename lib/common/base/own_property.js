/* jshint strict: true, undef: true */
/* globals spec, to_string */
/* globals exports */

spec(3, function own_property_returns_own_property() {

  return own_property('num')({num: 3});
});
spec(own_property('num'), [{n:4}], new Error('Key not found: "num" in {"n":4}'));

exports.own_property = own_property;
function own_property(name) {

  return function _own_property_(o) {
    if (!o.hasOwnProperty(name))
      throw new Error('Key not found: ' + to_string(name) + ' in ' + to_string(o));
    return o[name];
  };
} // === func own_property
