/* jshint strict: true, undef: true */
/* globals App, be, is_string, key_to_bool, is_boolean, $, spec_dom, spec */



spec('', function () { // show: shows element when key is true
  "use strict";

  spec_dom().html('<div data-do="show is_factor" style="display: none;">Factor</div>');
  App('run', {'dom-change': true});
  App('run', {is_factor: true});
  return spec_dom().find('div').attr('style');
});

spec('display: none;', function () { // does not alter element msg is missing key
  "use strict";

  spec_dom().html('<div data-do="show is_pearl" style="display: none;">Pearl</div>');
  App('run', {'dom-change': true});
  App('run', {is_factor: true});
  return spec_dom().find('div').attr('style');
});

function show(msg) {
  "use strict";

  var dom_id = be(is_string, msg.dom_id);
  var key    = be(is_string, msg.args[0]);

  App('create message function', function _show_(msg) {
    var answer = key_to_bool(key, msg);
    if (is_boolean(answer) !== true)
      return;
    $('#' + dom_id).show();
    return 'show: ' + dom_id;
  });
}
