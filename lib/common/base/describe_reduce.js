/* jshint strict: true, undef: true */

exports.describe_reduce = describe_reduce;

function describe_reduce(INFO, val, _args) {

  var funcs = to_array(arguments).slice(2);
  try {
    return reduce.apply(null, [val].concat(funcs));
  } catch (e) {
    e.message = INFO + ': ' + e.message;
    throw e;
  }
} // === function
