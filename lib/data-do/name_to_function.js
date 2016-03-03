/* jshint browser: true, strict: true, undef: true */
/* globals spec, is_string, to_string, _ */


spec(name_to_function, ["name_to_function"], name_to_function);

exports.name_to_function = name_to_function;
function name_to_function(raw) {
  "use strict";

  /* globals window, global */
/* globals exports */
  if (!is_string(raw))
    throw new Error('Not a string: ' + to_string(raw));
  var str = _.trim(raw);
  var func = window[str];
  if (typeof func !== 'function')
    throw new Error('Function not found: ' + to_string(raw));
  return (typeof 'window' !== 'undefined') ? window[str] : global[str];
}
