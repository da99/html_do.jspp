/* jshint strict: true, undef: true */
/* globals is_plain_object, be, $, spec_dom, spec, App, is_string, key_to_bool, is_boolean */




spec('', function _show_hide() { // === show_hide shows element if key = true
  "use strict";

  spec_dom().html('<div data-do="show_hide is_ruby" style="display: none;">Ruby</div>');
  App('run', {'dom-change': true});
  App('run', {is_ruby: true});
  return spec_dom().find('div').attr('style');
});

spec('display: none;', function _show_hide() { // === show_hide hides element if key = false
  "use strict";

  spec_dom().html('<div data-do="show_hide is_ruby" style="">Perl</div>');
  App('run', {'dom-change': true});
  App('run', {is_ruby: false});
  return spec_dom().find('div').attr('style');
});

function show_hide(msg) {
  "use strict";

  var dom_id = be(is_string, msg.dom_id);
  var key    = be(is_string, msg.args[0]);

  App('insert message function', function _show_hide_(msg) {
    if (!is_plain_object(msg))
      return;

    var answer = key_to_bool(key, msg);
    if (!is_boolean(answer))
      return;

    if (answer)
      return $('#' + dom_id).show();
    else
      return $('#' + dom_id).hide();
  });
}
