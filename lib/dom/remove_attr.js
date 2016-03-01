/* jshint strict: true, undef: true */
/* globals spec, spec_dom, _, $ */




// it 'returns value of the attribute'
spec('one', function remove_attr_returns_value_of_the_attribute() {
  "use strict";

  spec_dom().html('<div show_if="one"></div>');
  return remove_attr(spec_dom().find('div:first'), 'show_if');
});

// it 'removes attribute from node'
spec({id: 'remove_attr_1'}, function remove_attr_removes_attribute_from_node() {
  "use strict";

  spec_dom().html('<div id="remove_attr_1" show_if="one"></div>');
  remove_attr(spec_dom().find('div:first'), 'show_if');
  return _.reduce(
    spec_dom().find('div:first')[0].attributes,
    function (a, v) { a[v.name] = v.value; return a; },
    {}
  );
});

function remove_attr(node, name) {
  "use strict";

  var val = $(node).attr(name);
  $(node).removeAttr(name);
  return val;
}
