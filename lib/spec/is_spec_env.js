/* jshint strict: true, undef: true */
/* globals $, process */


// Specification function:
function is_spec_env() {
  "use strict";

  return (
    typeof(window) !== 'undefined' && $('#Spec_Stage').length === 1
  ) || (
    typeof(process) !== 'undefined' && process.argv[2] === 'test'
  );
}
