/* jshint strict: true, undef: true */
/* globals exports, _ */

exports.or = or;

function or(_funcs) {

  var funcs = _.toArray(arguments);

  return function (v) {
    return !!_.find(funcs, function (f) { return f(v) === true; });
  };
}
