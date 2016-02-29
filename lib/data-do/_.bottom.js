/* jshint strict: true, undef: true */
/* globals spec_returns, spec_dom, html_escape, App, wait_max, $, msg_match, length */
/* globals eachs, split_on, is_empty, to_string, name_to_function, apply_function, dom_id */

// ==== Integration tests =====================================================
// ============================================================================
spec_returns('yo mo', function button_submit(fin) {
  "use strict";
  spec_dom().html(
    '<form id="the_form" action="/repeat">' +
      '<script type="application/template" data-do="template ok_the_form replace">' +
        html_escape('<div>{{val1}} {{val2}}</div>') +
          '</script><button onclick="return false;" data-do="on_click submit_form">Submit</button>' +
            '<input type="hidden" name="val1" value="yo" />' +
            '<input type="hidden" name="val2" value="mo" />' +
            '</form>'
  );
  App('run', {'dom-change': true});
  spec_dom().find('button').click();
  wait_max(1.5, function () {
    var html = spec_dom().find('div').html();
    if (!html)
      return false;
    fin(html);
    return true;
  });
});

// === Adds functionality:
//     <div data-do="my_func arg1 arg2">content</div>
App('push', function process_data_dos(msg) {
  "use strict";
  var WHITESPACE = /\s+/g;
  // The other functions
  // may alter the DOM. So to prevent unprocessed DOM
  // or infinit loops, we process one element, then call the function
  // over until no other unprocessed elements are found.

  if (!msg_match({'dom-change': true}, msg))
    return;

  var selector = '*[data-do]:not(*[data-do_done~="yes"])';
  var elements = $('*[data-do]:not(*[data-do_done~="yes"]):first');

  if (length(elements) === 0)
    return;

  var raw_e = elements[0];

  $(raw_e).attr('data-do_done', 'yes');
  eachs(split_on(';', $(raw_e).attr('data-do')), function (_i, raw_cmd) {

    var args = split_on(WHITESPACE, raw_cmd);

    if (is_empty(args))
      throw new Error("Invalid command: " + to_string(raw_cmd));

    var func_name   = args.shift();
    var func        = name_to_function(func_name);

    apply_function(
      func, [{
        on_dom : true,
        dom_id : dom_id($(raw_e)),
        args : args.slice(0)
      }]
    );
    return;

  });

  process_data_dos(msg);

  return true;
}); // === App push process_data_dos ==========================================



