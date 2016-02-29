/* jshint strict: true, undef: true */
/* globals msg_match, is_string, $, dom_id, alite, formToObj, is_plain_object, log, is_blank_string */
/* globals App */

function submit_form(msg) {
  "use strict";

  if (!msg_match({dom_id: is_string}, msg))
    return;

  var form = $('#' + msg.dom_id).closest('form');
  var raw_form = form[0];

  if (!raw_form)
    return;

  var form_dom_id = dom_id(form);

  // the form_id
  // the form as a data structure
  // Create callback for response
  //   -- standardize response
  //   -- send to Computer/App
  // Send to ajax w/callback
  alite({url: form.attr('action'), method: 'POST', data: formToObj(raw_form)}).then(
    function (result) {
      // At this point, we don't know if it's success or err:
      var data = {
        ajax_response : true,
        result: result,
        data: result.data || {}
      };

      // === If err:
      if (!is_plain_object(result) || !result.ok) {
        data.msg = result.msg || "Computer error. Try again later.";
        data['err_' + form_dom_id] = true;
        App('run', data);
        return;
      }

      // === else success:
      data['ok_' + form_dom_id] = true;
      App('run', data);
    }
  ).catch(
    function (err) {
      log(err);
      var data = { ajax_err : true };
      if (is_string(err)) {
        if (is_blank_string(err))
          data.msg = "Network error.";
        else
          data.msg = err;
      }
      data['err_' + form_dom_id] = true;
      App('run', data);
    }
  );
} // === function submit_form
