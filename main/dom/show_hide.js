



spec_returns('', function _show_hide() { // === show_hide shows element if key = true
  spec_dom().html('<div data-do="show_hide is_ruby" style="display: none;">Ruby</div>');
  App('run', {'dom-change': true});
  App('run', {is_ruby: true});
  return spec_dom().find('div').attr('style');
});
spec_returns('display: none;', function _show_hide() { // === show_hide hides element if key = false
  spec_dom().html('<div data-do="show_hide is_ruby" style="">Perl</div>');
  App('run', {'dom-change': true});
  App('run', {is_ruby: false});
  return spec_dom().find('div').attr('style');
});
function show_hide(msg) {
  var dom_id = should_be(msg.dom_id, is_string);
  var key    = should_be(msg.args[0], is_string);

  App('push', function _show_hide_(msg) {
    if (!is_plain_object(msg))
      return;

    var answer = key_to_bool(key, msg);
    if (!is_bool(answer))
      return;

    if (answer)
      return $('#' + dom_id).show();
    else
      return $('#' + dom_id).hide();
  });
}
