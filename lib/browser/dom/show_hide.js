/* jshint strict: true, undef: true */
/* globals is_plain_object, be, $, spec_dom, spec, App, is_string, key_to_bool, is_boolean */




spec('', function _show_hide() { // === show_hide shows element if key = true

  spec_dom().html('<div data-do="show_hide is_ruby" style="display: none;">Ruby</div>');
  App('send message', {'dom-change': true});
  App('send message', {is_ruby: true});
  return spec_dom().find('div').attr('style');
});

spec('display: none;', function _show_hide() { // === show_hide hides element if key = false

  spec_dom().html('<div data-do="show_hide is_ruby" style="">Perl</div>');
  App('send message', {'dom-change': true});
  App('send message', {is_ruby: false});
  return spec_dom().find('div').attr('style');
});

function show_hide(msg) {

  var dom_id = be(is_string, msg.dom_id);
  var key    = be(is_string, msg.args[0]);

  App('create message function', function _show_hide_(msg) {
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
