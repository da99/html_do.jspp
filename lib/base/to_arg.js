/* jshint strict: true, undef: true */

exports.to_arg = to_arg;
function to_arg(val) { "use strict"; return function (f) { return f(val); }; }
