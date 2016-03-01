/* jshint strict: true, undef: true */
/* globals $, process */
/* globals exports */


// Specification function:
exports.is_spec_env = is_spec_env;
function is_spec_env() {
  "use strict";

  return (
    typeof(window) !== 'undefined' && $('#Spec_Stage').length === 1
  ) || (
    typeof(process) !== 'undefined' && process.argv[2] === 'test'
  );
}
