/* jshint strict: true, undef: true */
/* globals is_spec_env, spec */


// Specification function:
//   Accepts:
//     f - function
//   Runs function (ie test) with all other tests
//   when spec_run is called.
exports.spec_push = spec_push;
function spec_push(f) {
  "use strict";

  if (!is_spec_env())
    return false;
  if (!spec.specs)
    spec.specs = [];
  spec.specs = ([]).concat(spec.specs).concat([f]);
  return true;
}
