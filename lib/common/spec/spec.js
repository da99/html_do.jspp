/* jshint strict: true, undef: true */
/* globals _, App, to_match_string, log, to_string, to_function_string */
/* globals exports, is_empty, length, is_function, is_plain_object */
/* globals $, process */
/* globals window, _, is_empty, function_to_name, spec_dom */
/* globals _, is_array, to_string, to_function_string, to_match_string, log */
/* globals exports, wait_max, is_error, is_string, is_regexp, spec */


// === Expect:
// spec(my_func,             ["my args"],           "my expected value");
// spec("my expected value", function my_custom_spec() {
//   return "a value";
// });
//
// === Throws:
// spec(my_func, ["my args"], new Error("my expected thrown error"));
// spec(
//   new Error("my expected thrown error"),
//   function my_custom_spec() {
//     throw new Error("something");
//   }
// );
//
// === Run specs:
// spec('send message');
// spec(function (msg) {
//  log('Finished specs: ' + msg.total);
// });
//
// === Used by other functions to continue running specs:
// spec({
//    list: [],
//    i:"init"|0|positive,
//    on_finish: my_callback
// });
//

exports.spec = spec;

// === Is there a specific spec to run?
(function () {
  "use strict";

  if (typeof window === 'undefined')
    return;
  var href = window.location.href;
  var target = _.trim(href.split('?').pop() || '');
  if (!is_empty(target) && target !== href  && target !== function_to_name("str_or_func"))
    return false;

  // === Reset DOM:
  spec_dom('reset');
  spec.target = target;
})();

function spec() {
  "use strict";

  var is_allowed = (
    ( typeof(window) !== 'undefined' && $('#Spec_Stage').length === 1) ||
      ( typeof(process) !== 'undefined' && process.argv[2] === 'test')
  );

  if (!is_allowed)
    return;

  var args = _.toArray(arguments);

  if (length(args) !== 1) {
    return App('push into or create', 'specs', args);
  } // === switch

  if (args[0] !== 'run' && !is_function(args[0]))
    throw new Error('Unknown value: ' + to_string(args[0]));

  App('create or ignore', 'spec on finishs', []);
  App('create or ignore', 'specs done', []);
  var specs = App('read or create', 'specs', []);
  var i     = App('read or create', 'spec.index', 0);

  if (is_empty(specs))
    throw new Error('No specs found.');

  if (is_function(arguments[0]))
    App('push into', 'spec on finishs', arguments[0]);

  while ( i < specs.length) {
    if (run_spec(i, specs[i]) === 'wait')
      return 'wait';
    i = App('read', 'spec.index');
  }

  var passed = App('read', 'spec.index');
  if (specs.length < passed)
    throw new Error("Total specs: " + specs.length + " != Passed specs: " + passed);

  var on_fins = App('read', 'spec on finishs');
  if (is_empty(on_fins)) {
    on_fins.push(spec.default_msg);
  }

  var msg = {total: specs.length};
  for (var func_i = 0; func_i < on_fins.length; func_i++)
    on_fins[func_i](msg);

  return 'finish';

  function actual_equals_expect(actual, expect) {
    if (_.isEqual(actual, expect))
      return true;

    if (_.isString(actual) && _.isRegExp(expect) && actual.match(expect))
      return true;

    if (actual && actual.constructor === Error && expect && expect.constructor && actual.message === expect.message)
      return true;

    if (actual && actual.constructor === Error && _.isRegExp(expect) && actual.message.match(expect))
      return true;

    if (is_error(actual))
      throw actual;

    return false;
  }

  function run_spec(index, raw_spec) {

    var f, args, expect, actual;

    if (raw_spec.length === 2 && _.isFunction(raw_spec[1])) {
        f      = raw_spec[1];
        args   = (length(f) > 0) ? [compare_actual] : [];
        expect = raw_spec[0];
    } else {
      if (raw_spec.length === 3 && _.isFunction(raw_spec[0])) {
        f      = raw_spec[0];
        args   = raw_spec[1];
        expect = raw_spec[2];
      } else {
        throw new Error("Invalid spec: " + to_string(raw_spec));
      }
    }

    // === Handle async specs:
    if (args[0] === compare_actual) {
      f.apply(null, args);
      wait_max(3, function () {
        if (!_.includes(App('read', 'specs done'), index))
          return false;
        spec('run');
        return true;
      });
      return "wait";
    } // === if =======================

    try {
      actual = f.apply(null, args);
    } catch (e) {
      actual = e;
    }
    compare_actual(actual);
    return true;

    function compare_actual(actual) {
      var sig = to_function_string(f, args);
      var msg = to_match_string(actual, expect);

      if (!actual_equals_expect(actual, expect)) {
        log(f, args, expect, actual);
        throw new Error("!!! Failed: " + sig + ' -> ' + msg );
      }

      log('=== Passed: ' + sig + ' -> ' + msg);
      App('+1', 'spec.index');
      App('push into', 'specs done', index);
    } // === compare_actual
  } // === function regular_spec

} // === function spec

spec.default_msg = function default_msg(msg) {
  "use strict";
  log('      ======================================');
  log('      Specs Finish: ' + to_string(msg.total) + ' tests');
  log('      ======================================');
};


