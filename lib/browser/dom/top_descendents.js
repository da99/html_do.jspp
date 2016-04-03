/* jshint strict: true, undef: true */
/* globals spec, spec_dom, _, next_id, $ */



spec('top_descendents_returns_self_if_selector_matches', function top_descendents_returns_self_if_selector_matches() {
  "use strict";

  spec_dom().html('<div id="top_descendents_returns_self_if_selector_matches" template="num"></div>');
  return top_descendents(spec_dom().children(), '*[template]')[0].attr('id');
});

spec(['SPAN', 'SPAN'], function () { // it 'returns first children matching selector'
  "use strict";

  spec_dom().html('<div><span class="top"></span><span class="top"></span></div>');
  return _.map(
    top_descendents(spec_dom().children(), '.top'),
    function (n) { return n[0].tagName; }
  );
});


spec([['DIV', 'top_descendents_1']], function () { // does not return nested matching descendants if ancestor matches selector'
  "use strict";

  var id = next_id();
  spec_dom().html(
    '<div><div id="top_descendents_1" class="top"><span class="top"></span><span class="top"></span></div><div>'
  );
  return _.map(
    top_descendents(spec_dom().children(), '.top'),
    function (n) { return [n[0].tagName, n.attr('id')]; }
  );
});

function top_descendents(dom, selector) {
  "use strict";

  var arr = [];
  _.each($(dom), function (node) {
    var o = $(node);
    if (o.is(selector))
      return arr.push(o);
    arr = arr.concat(top_descendents(o.children(), selector));
  }); // === func

  return arr;
}
