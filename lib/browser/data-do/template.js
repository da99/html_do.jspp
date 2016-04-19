/* jshint strict: true, undef: true */
/* globals App, html_escape, to_function, dot, map_x, to_$, $, msg_match, key_to_bool, be */
/* globals is_string, eachs, html_unescape, Mustache, dom_id */
/* globals spec, spec_dom, _, describe_reduce, is_plain_object, is_array */

spec(['SCRIPT', 'SPAN', 'P'], function template_replaces_elements_by_default() {
  spec_dom().html(
    '<script type="application/template" data-do="template is_text">' +
      html_escape('<span>{{a1}}</span>') +
      html_escape('<p>{{a2}}</p>') +
        '</script>'
  );

  App('send message', {'dom-change': true});
  App('send message', {is_text: true, data: {a1: '1', a2: '2'}});
  App('send message', {is_text: true, data: {a1: '3', a2: '4'}});
  return _.map(spec_dom().children(), dot('tagName'));
});

spec(['SCRIPT','P','DIV'], function template_renders_elements_below_by_default() {
  spec_dom().html(
    '<script type="application/template" data-do="template is_text replace">' +
      html_escape('<p>one</p>') +
      html_escape('<div>two</div>') +
        '</script>'
  );

  App('send message', {'dom-change': true});
  App('send message', {is_text: true});
  return _.map(spec_dom().children(), dot('tagName'));
});

spec('123', function template_renders_nested_vars() {
  spec_dom().html(
    '<script type="application/template" data-do="template is_text replace">'+
      html_escape('<p>{{a}}</p>') +
      html_escape('<p>{{b}}</p>') +

      html_escape('<script type="application/template" data-do="template is_val replace">') +
        html_escape(html_escape('<p>{{c}}</p>')) +
      html_escape('</script>') +
    '</script>'
  );
  App('send message', {'dom-change': true});
  App('send message', {is_text: true, data: {a: 1, b: 2}});
  App('send message', {is_val: true, data: {c:'3'}});

  return map_x(spec_dom().find('p'), to_function(to_$, dot('html()'))).join('');
});

spec(['P', 'P', 'SCRIPT'], function template_renders_above() {
  spec_dom().html(
    '<script type="application/template" data-do="template is_text above">'+
      html_escape('<p>{{a}}</p>') + html_escape('<p>{{b}}</p>') +
    '</script>'
  );
  App('send message', {'dom-change': true});
  App('send message', {is_text: true, data: {a: 4, b: 5}});
  return map_x(spec_dom().children(), dot('tagName'));
});

spec(['SCRIPT', 'SPAN', 'P'], function template_renders_below() {
  spec_dom().html(
    '<script type="application/template" data-do="template is_text bottom">'+
      html_escape('<span>{{a}}</span>') + html_escape('<p>{{b}}</p>') +
    '</script>'
  );
  App('send message', {'dom-change': true});
  App('send message', {is_text: true, data: {a: 6, b: 7}});
  return map_x(spec_dom().children(), dot('tagName'));
});

spec('none', function template_renders_dum_functionality() {
  spec_dom().html(
    '<script type="application/template" data-do="template render_template replace">' +
      html_escape('<div><span id="template_1" data-do="hide is_num">{{num.word}}</span></div>') +
      '</script>'
  );
  App('send message', {'dom-change': true});
  App('send message', {render_template: true});
  App('send message', {is_num: true, data: {num: {word: 'one'}}});
  return $('#template_1').css('display');
});

function template(msg) {
  if (!msg_match({dom_id: is_string}, msg))
    return;

  var key = describe_reduce(
    "Getting first arg for template key: ",
    msg.args[0],
    be(is_string)
  );

  var pos = describe_reduce(
    "Getting position for template: ",
    msg.args[1],
    to_default('replace'),
    be(is_string)
  );

  var t        = $('#' + msg.dom_id);
  var raw_html = t.html();
  var id       = msg.dom_id;

  function _template_(future_msg) {
    if (key_to_bool(key, future_msg) !== true)
      return;

    var me = _template_;

    // === Init state:
    if (!is_plain_object(me.elements))
      me.elements = {};
    if (!is_array(me.elements[id]))
      me.elements[id] = [];

    // === Remove old nodes:
    if (pos === 'replace') {
      eachs(me.elements[id], function (_index, id) {
        $('#' + id).remove();
      });
    }

    var decoded_html = html_unescape(raw_html);
    var compiled = $(Mustache.render(decoded_html, future_msg.data || {}));
    var new_ids = _.map(compiled, function (x) { return dom_id($(x)); });

    if (pos === 'replace' || pos === 'bottom')
      compiled.insertAfter($('#' + id));
    else
      compiled.insertBefore($('#' + id));

    me.elements[id] = ([]).concat(me.elements[id]).concat( new_ids );

    App('send message', {'dom-change': true});
    return new_ids;
  }

  App('create message function', _template_);
} // ==== funcs: template ==========


