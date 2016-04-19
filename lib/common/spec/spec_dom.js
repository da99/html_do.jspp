/* jshint strict: true, undef: true */
/* globals $, to_string */
/* globals exports */


// Specification function:
// Accepts:
//   string : 'reset'  => Reset dom for next test.
exports.spec_dom = spec_dom;
function spec_dom(cmd) {

  switch (cmd) {
    case 'reset':
      var stage = $('#Spec_Stage');
      if (stage.length === 0)
        $('body').prepend('<div id="Spec_Stage"></div>');
      else
        stage.empty();
      break;

    default:
      if (arguments.length !== 0)
      throw new Error("Unknown value: " + to_string(arguments));
  } // === switch cmd

  return $('#Spec_Stage');
}
