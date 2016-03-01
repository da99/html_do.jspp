/* jshint strict: true, undef: true */
/* globals spec_returns, identity, to_string, is_function, _, apply_function */
/* globals exports */

spec_returns(true, function to_function_returns_sole_function() {
  "use strict";

  var f = function () {};
  return to_function(f) === f;
});

spec_returns(2, function to_function_returns_an_identity_function() {
  "use strict";

  return to_function(2)();
});

spec_returns('"3"', function to_function_returns_a_function() {
  "use strict";

  return to_function(identity, to_string, to_string)(3);
});

exports.to_function = to_function;
function to_function() {
  "use strict";

  if (arguments.length === 1) {
    if (is_function(arguments[0])) {
      return arguments[0];
    } else{
      var x = arguments[0];
      return function () { return x; };
    }
  }

  var i = 0, f;
  var l = arguments.length;
  while (i < l) {
    f = arguments[i];
    if (!_.isFunction(f))
      throw new Error('Not a function: ' + to_string(f));
    i = i + 1;
  }

  var funcs = arguments;
  return function () {
    var i = 0, f, val;
    while (i < l) {
      f = funcs[i];
      if (i === 0) {
        if (f.length !== arguments.length)
          throw new Error('Function.length ' + f.length + ' ' + to_string(f) + ' !=== arguments.length ' +  arguments.length + ' ' + to_string(arguments));
        val = apply_function(f, arguments);
      } else {
        if (f.length !== 1)
          throw new Error('Function.length ' + f.length + ' !=== 1');
        val = apply_function(f, [val]);
      }
      i = i + 1;
    }
    return val;
  }; // return
}
