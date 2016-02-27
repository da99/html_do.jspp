"use strict";
/* jshint globalstrict: true, undef: true */
/* globals spec_dom, spec, spec_returns */
/* globals setTimeout, alite, formToObj, Mustache, promise, _, $, window, console, DOMParser  */
/* globals App, to_value, arguments_are, has_property_of */
/* globals is_bool, is_empty, is_num, should_be, is_string, is_plain_object, key_to_bool */

if (typeof window === 'undefined')
  throw new Error('No window defined.');

function to_$(x) { return $(x); }

spec(is_dev, [], window.location.href.indexOf('/specs.html') > 0);
function is_dev() {
  var addr = window.location.href;
  return window.console && (addr.indexOf("localhost") > -1 ||
    addr.indexOf("file:///") > -1 ||
    addr.indexOf("127.0.0.1") > -1)
  ;
} // === func


spec(html_escape, ['<p>{{a}}</p>'], '&lt;p&gt;&#123;&#123;a&#125;&#125;&lt;/p&gt;');
function html_escape(str) {
  return _.escape(str).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}

spec(html_unescape, ["&lt;p&gt;&#123;&#123;1&#125;&#125;&lt;/p&gt;"], '<p>{{1}}</p>');
spec_returns('<p>{{1}}</p>', function html_unescape_multiple_times() {
  return to_value(
    '<p>{{1}}</p>',
    html_escape, html_escape, html_escape,
    html_unescape, html_unescape, html_unescape
  );
});
function html_unescape(raw) {
  // From: http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
  return (new DOMParser().parseFromString(raw, "text/html"))
  .documentElement
  .textContent;
}


function is_$(v) {
  return v && typeof v.html === 'function' && typeof v.attr === 'function';
}

spec(dom_attrs, [$('<div id="000" img=".png"></div>')[0]], {id: "000", img: ".png"});
spec(dom_attrs, [$('<div class="is_happy"></div>')[0]], {"class": 'is_happy'});
function dom_attrs(dom) {
  arguments_are(arguments, has_property_of('attributes', 'object'));

  return _.reduce(
    dom.attributes,
    function (kv, o) {
      kv[o.name] = o.value;
      return kv;
    },
    {}
  );
} // === attrs

spec_returns('has id', function dom_id_adds_id_attr_to_element() {
  spec_dom().html('<div>has id</div>');
  var id = dom_id(spec_dom().find('div:first'));
  return $('#' + id).html();
});

spec_returns('dom_id_does_not_override_original_id', function dom_id_does_not_override_original_id() {
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


// Examples:
//
//   .new_id()           ->  Integer
//   .new_id('prefix_')  ->  String
//
function new_id(prefix) {
  if (!new_id.hasOwnProperty('_id'))
    new_id._id = -1;
  new_id._id = new_id._id + 1;
  return (prefix) ? prefix + new_id._id : new_id._id;
} // === func

// it 'returns an Array when passed a String'
spec(node_array, ['<div id="111" show_if="happy?"><span></span></div>'], [
  {
    tag:   'DIV',
    attrs:  {id: '111', show_if: 'happy?'},
    custom: {},
    childs: [
      {tag: 'SPAN', attrs: {}, custom: {}, childs: []}
    ]
  }
]);

spec_returns(['a', undefined, 'b'], function node_array_returns_raw_text_nodes() {
  var arr = node_array('<div><span>a<span></span>b</span></div>');
  return _.pluck(arr[0].childs[0].childs, 'nodeValue');
});
function node_array(unknown) {
  var arr = [];
  _.each($(unknown), function (dom) {
    if (dom.nodeType !== 1)
      return arr.push(dom);

    arr.push({
      tag    : dom.nodeName,
      attrs  : dom_attrs(dom),
      custom : {},
      childs : node_array($(dom).contents())
    });
  });

  return arr;
}

function outer_html(raw) {
  return raw.map(function () {
    return $(this).prop('outerHTML');
  }).toArray().join('');
}


spec_returns('top_descendents_returns_self_if_selector_matches', function top_descendents_returns_self_if_selector_matches() {
  spec_dom().html('<div id="top_descendents_returns_self_if_selector_matches" template="num"></div>');
  return top_descendents(spec_dom().children(), '*[template]')[0].attr('id');
});

spec_returns(['SPAN', 'SPAN'], function () { // it 'returns first children matching selector'
  spec_dom().html('<div><span class="top"></span><span class="top"></span></div>');
  return _.map(
    top_descendents(spec_dom().children(), '.top'),
    function (n) { return n[0].tagName; }
  );
});


spec_returns([['DIV', 'top_descendents_1']], function () { // does not return nested matching descendants if ancestor matches selector'
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
  var arr = [];
  _.each($(dom), function (node) {
    var o = $(node);
    if (o.is(selector))
      return arr.push(o);
    arr = arr.concat(top_descendents(o.children(), selector));
  }); // === func

  return arr;
}



// it 'returns value of the attribute'
spec_returns('one', function remove_attr_returns_value_of_the_attribute() {
  spec_dom().html('<div show_if="one"></div>');
  return remove_attr(spec_dom().find('div:first'), 'show_if');
});

// it 'removes attribute from node'
spec_returns({id: 'remove_attr_1'}, function remove_attr_removes_attribute_from_node() {
  spec_dom().html('<div id="remove_attr_1" show_if="one"></div>');
  remove_attr(spec_dom().find('div:first'), 'show_if');
  return _.reduce(
    spec_dom().find('div:first')[0].attributes,
    function (a, v) { a[v.name] = v.value; return a; },
    {}
  );
});
function remove_attr(node, name) {
  var val = $(node).attr(name);
  $(node).removeAttr(name);
  return val;
}


spec_returns(false, function () { // next_id returns a different value than previous
  return next_id() === next_id();
});
function next_id() {
  if (!is_num(next_id.count))
    next_id.count = -1;
  next_id.count = next_id.count + 1;
  if (is_empty(arguments))
    return next_id.count;
  return arguments[0] + '_' + next_id.count;
}


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

