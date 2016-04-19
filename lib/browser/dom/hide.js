/* jshint strict: true, undef: true */
/* globals App, is_string, key_to_bool, is_string, $, spec_dom, spec, be */


spec('display: none;', function () { // hide: hides element when key is true

  spec_dom().html('<div data-do="hide is_factor">Factor</div>');
  App('send message', {'dom-change': true});
  App('send message', {is_factor: true});
  return spec_dom().find('div').attr('style');
});

spec('', function () { // does not alter element if msg has missing key

  spec_dom().html('<div data-do="hide is_dog" style="">Dog</div>');
  App('send message', {'dom-change': true});
  App('send message', {is_cat: true});
  return spec_dom().find('div').attr('style');
});

function hide(msg) {

  var dom_id = be(is_string, msg.dom_id);
  var key    = be(is_string, msg.args[0]);
  App('create message function', function _hide_(msg) {
    if (key_to_bool(key, msg) !== true)
      return;
    $('#' + dom_id).hide();
    return 'hide: ' + msg.dom_id;
  });
}
