/* jshint strict: true, undef: true */
/* globals _, App, to_match_string, log, to_string, to_function_string */
/* globals exports, is_empty, length, is_function, is_plain_object */
/* globals $, process */
/* globals window, _, is_empty, function_to_name, spec_dom */
/* globals _, is_array, to_string, to_function_string, to_match_string, log */
/* globals exports, is_string, is_regexp, spec */


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
// spec('run');
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

spec.allow = (
  ( typeof(window) !== 'undefined' && $('#Spec_Stage').length === 1) ||
  ( typeof(process) !== 'undefined' && process.argv[2] === 'test')
);

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

  if (!spec.allow)
    return undefined;

  var args = _.toArray(arguments);

  if (length(args) !== 1) {
    App('push into', 'specs', args);
    return true;
  } // === switch

  if (args[0] !== 'run' && !is_function(args[0]) && !is_plain_object(args[0]))
    throw new Error('Unknown value: ' + to_string(args[0]));

  var specs = App('read or insert', 'specs', []);

  if (is_empty(specs))
    throw new Error('No specs found.');

  var on_fin = (is_function(arguments[0]) && arguments[0]) || function (msg) {
    log('      ======================================');
    log('      Specs Finish: ' + to_string(msg.total) + ' tests');
    log('      ======================================');
  };

  _.each(specs, function (raw_spec) {

    var was_found = _.find(
      [regular, returns],
      function (spec_f) {
        return spec_f.apply(null, raw_spec);
      }
    );
    if (!was_found)
      throw new Error("Invalid spec: " + to_string(raw_spec));

  }); // === each

  on_fin({total: specs.length});
  return true;

  function actual_expect(actual, expect) {
    return _.isEqual(actual, expect) ||
      (_.isString(actual) && _.isRegExp(expect) && actual.match(expect)) ||
        (actual && actual.constructor === Error && expect && expect.constructor && actual.message === expect.message) ||
        (actual && actual.constructor === Error && _.isRegExp(expect) && actual.message.match(expect))
        ;
  }

  function returns(expect, f) {
    if (!(arguments.length === 2 && _.isFunction(f)))
      return false;

    if (length(f) !== 0) {
      throw new Error('async test not done yet.');
    } // if f.length === 0

    var actual;
    var sig = function_to_name(f);

    try {
      actual = f();
    } catch (e) {
      actual = e;
    }

    var msg = to_match_string(actual, expect);
    if (!actual_expect(actual,expect)) {
      log([to_string(expect), to_string(f)]);
      throw new Error("!!! Failed: " + sig + ' -> ' + msg);
    }
    log('=== Passed: ' + sig + ' -> ' + msg);
    return true;

    // === Async func:
    function async_returns(fin) {

      // spec('async', {
      //   i : 'init',
      //   list: spec.specs.slice(0),
      //   dones: {},
      //   on_finish: on_fin,
      //   total: 0
      // });

      var sig = function_to_name(f);
      f(function (actual) {
        var msg = to_match_string(actual, expect);
        if (!actual_expect(actual,expect))
          throw new Error("!!! Failed: " + sig + ' -> ' + msg);
        log('=== Passed: ' + sig + ' -> ' + msg);
        fin();
        return true;
      });
    } // == function async_returns
  } // === function spec_returns

  function regular(f, args, expect) {
    if (arguments.length !== 3)
      return false;
    if (typeof(f) !== 'function')
      return false;

    var actual;
    var sig    = to_function_string(f, args);

    try {
      actual = f.apply(null, args);
    } catch (e) {
      actual = e;
    }

    var msg = to_match_string(actual, expect);

    if (!actual_expect(actual, expect)) {
      log(f, args, expect);
      throw new Error("!!! Failed: " + sig + ' -> ' + msg );
    }

    log('=== Passed: ' + sig + ' -> ' + msg);
    return true;
  } // === function regular_spec

} // === function spec


