/* jshint strict: true, undef: true */
/* globals spec, spec_dom, $, _, is_empty, new_id */

spec('has id', function dom_id_adds_id_attr_to_element() {

  spec_dom().html('<div>has id</div>');
  var id = dom_id(spec_dom().find('div:first'));
  return $('#' + id).html();
});

spec('dom_id_does_not_override_original_id', function dom_id_does_not_override_original_id() {

  spec_dom().html('<div id="dom_id_does_not_override_original_id">override id</div>');
  return dom_id(spec_dom().find('div:first'));
});

// Returns id.
// Sets id of element if no id is set.
//
// .dom_id(raw_or_jquery)
// .dom_id('prefix', raw_or_jquer)
function dom_id() {

  var args   = _.toArray(arguments);
  var o      = _.find(args, _.negate(_.isString));
  var prefix = _.find(args, _.isString);
  var old    = o.attr('id');

  if (old && !is_empty(old))
    return old;

  var str = new_id(prefix || 'default_id_');
  o.attr('id', str);
  return str;
} // === id
