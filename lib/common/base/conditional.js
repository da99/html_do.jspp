/* jshint strict: true, undef: true */
/* globals _ */
/* globals exports */

exports.conditional = conditional;
function conditional(name, funcs) {

  if (funcs.length < 2)
    throw new Error("Called with too few arguments: " + arguments.length);

  if (!_[name])
    throw new Error("_." + name + " does not exist.");

  return function (v) {
    return _[name](funcs, function (f) { return f(v); });
  };
}
