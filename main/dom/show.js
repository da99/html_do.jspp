


spec_returns('', function () { // show: shows element when key is true
  spec_dom().html('<div data-do="show is_factor" style="display: none;">Factor</div>');
  App('run', {'dom-change': true});
  App('run', {is_factor: true});
  return spec_dom().find('div').attr('style');
});
spec_returns('display: none;', function () { // does not alter element msg is missing key
  spec_dom().html('<div data-do="show is_pearl" style="display: none;">Pearl</div>');
  App('run', {'dom-change': true});
  App('run', {is_factor: true});
  return spec_dom().find('div').attr('style');
});
function show(msg) {
  var dom_id = should_be(msg.dom_id, is_string);
  var key    = should_be(msg.args[0], is_string);
  App('push', function _show_(msg) {
    var answer = key_to_bool(key, msg);
    if (is_bool(answer) !== true)
      return;
    $('#' + dom_id).show();
    return 'show: ' + dom_id;
  });
}
