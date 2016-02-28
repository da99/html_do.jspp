/* jshint strict: true, undef: true */

function to_arg(val) { "use strict"; return function (f) { return f(val); }; }
