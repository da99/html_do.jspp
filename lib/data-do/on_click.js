/* jshint strict: true, undef: true */
/* globals msg_match, has_length, is_string, be, is_array, and, window, is_function, $ */

/*
   <button data-do="on_click my_func">Click Me</button>
   --> my_func({dom_id: dom_id});
*/
function on_click(msg) {

  if (!msg_match({dom_id: is_string, args: and(is_array, has_length(1))}, msg))
    return;

  var dom_id = msg.dom_id;
  var func   = describe_reduce(
    "Getting function for on_click",
    window[msg.args[0]],
    be(is_function)
  );

  if (!on_click.processed)
    on_click.processed = {};

  if (on_click.processed[dom_id])
    throw new Error('#' + dom_id + ' already processed by on_click');

  on_click.processed[dom_id] = true;

  $('#' + msg.dom_id).on("click", function (e) {
    e.stopPropagation();
    func({dom_id: dom_id});
  });
} // === function
