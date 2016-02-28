/* jshint strict: true, undef: true */
/* globals is_spec_env, window, _, is_empty, function_to_name, spec_dom */


// Specification function:
// Accepts:
//   str_or_func : The function the spec is about.
function spec_new(str_or_func) {
  "use strict";

  if (!is_spec_env())
    return false;

  // === Is there a specific spec to run?
  if (typeof window !== 'undefined') {
    var href = window.location.href;
    var target = _.trim(href.split('?').pop() || '');
    if (!is_empty(target) && target !== href  && target !== function_to_name(str_or_func))
      return false;

    // === Reset DOM:
    spec_dom('reset');
  }

  return true;
}
