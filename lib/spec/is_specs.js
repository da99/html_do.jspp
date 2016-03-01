/* jshint strict: true, undef: true */
/* globals be, is, not, is_empty, or, is_plain_object, is_positive */


exports.is_specs = is_specs;
function is_specs(specs) {
  "use strict";

  var is_valid_specs_i = or(is('init'), is(0), is_positive);

  be(is_plain_object,  specs);
  be(not(is_empty),    specs.list);
  be(is_valid_specs_i, specs.i);
  be(is_plain_object,  specs.dones);
  return true;
}
