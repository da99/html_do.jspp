

spec_returns('display: none;', function () { // hide: hides element when key is true
  spec_dom().html('<div data-do="hide is_factor">Factor</div>');
  App('run', {'dom-change': true});
  App('run', {is_factor: true});
  return spec_dom().find('div').attr('style');
});
spec_returns('', function () { // does not alter element if msg has missing key
  spec_dom().html('<div data-do="hide is_dog" style="">Dog</div>');
  App('run', {'dom-change': true});
  App('run', {is_cat: true});
  return spec_dom().find('div').attr('style');
});
function hide(msg) {
  var dom_id = should_be(msg.dom_id, is_string);
  var key    = should_be(msg.args[0], is_string);
  App('push', function _hide_(msg) {
    if (key_to_bool(key, msg) !== true)
      return;
    $('#' + dom_id).hide();
    return 'hide: ' + msg.dom_id;
  });
}
