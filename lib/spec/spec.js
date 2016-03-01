/* jshint strict: true, undef: true */
/* globals _, App, to_match_string, log, to_string, to_function_string */
/* globals exports, is_empty, length, is_function, is_plain_object */
/* globals $, process */
/* globals window, _, is_empty, function_to_name, spec_dom */
/* globals _, to_string, to_function_string, to_match_string, log */
/* globals exports, is_string, is_regexp, spec */


// === Examples:
// spec(my_func, ["my args"], "my expected value");
// spec("my expected value", function my_custom_spec() {});
//
// spec(my_func, ["my args"], new Error("my expected thrown error"));
// spec(new Error("my expected thrown error"), function my_custom_spec() {});
//
// === Run specs:
// spec('run');
// spec(function (msg) {
//  log('Finished specs: ' + msg.total);
// });
//
// === Used by other functions to continue running specs:
// spec_run({
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

  var specs = App('get', 'specs', []);

  if (is_empty(specs))
    throw new Error('No specs found.');

  var on_fin = (is_function(arguments[0]) && arguments[0]) || function (msg) {
    log('      ======================================');
    log('      Specs Finish: ' + to_string(msg.total) + ' tests');
    log('      ======================================');
  };

  _.each(specs, function (raw_spec) {

    log(raw_spec);

    // === Is there a specific spec to run?
    if (typeof window !== 'undefined') {
      var href = window.location.href;
      var target = _.trim(href.split('?').pop() || '');
      if (!is_empty(target) && target !== href  && target !== function_to_name("str_or_func"))
        return false;

      // === Reset DOM:
      spec_dom('reset');
    }

    function spec_throws(f, args, expect) {
      if (is_string(expect))
        expect = new Error(expect);
      if (is_regexp(expect)) {
        var regexp = expect;
        expect = function (err) { return err.message.match(regexp); };
      }
      return spec.apply(null, [f, args, expect]);
    } // === function spec_throws

function spec_returns(expect, f) {

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  if (length(f) === 0) {
    return returns(expect, f);
  } // if f.length === 0
  throw new Error('async test not done yet.');

  function returns(expect, f) {
    var sig = function_to_name(f);
    var actual = f();
    var msg = to_match_string(actual, expect);
    if (!_.isEqual(actual,expect))
      throw new Error("!!! Failed: " + sig + ' -> ' + msg);
    log('=== Passed: ' + sig + ' -> ' + msg);
    return true;
  }

  // === Async func:
  function async_returns(fin) {
    var sig = function_to_name(f);
    f(function (actual) {
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      fin();
      return true;
    });
  }
} // === spec_returns

    function regular_spec(f, args, expect) {
      var sig    = to_function_string(f, args);
      var actual = f.apply(null, args);
      var msg    = to_match_string(actual, expect);

      if (actual !== expect && !_.isEqual(actual, expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg );

      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    } // === function regular_spec

    function throws(f, args, expect) {
      var actual, err;
      var sig = to_function_string(f, args);

      try {
        f.apply(null, args);
      } catch (e) {
        err = e;
        actual = e.message;
      }

      var msg = to_match_string(actual, expect);

      if (!actual)
        throw new Error('!!! Failed to throw error: ' + sig + ' -> ' + expect);

      if (_.isEqual(actual, expect)) {
        log('=== Passed: ' + sig + ' -> ' + expect);
        return true;
      }

      log(err);
      throw new Error('Error message does not match: ' + to_string(actual) + ' !== ' + to_string(expect) );
    } // === function throws

    // spec('async', {
    //   i : 'init',
    //   list: spec.specs.slice(0),
    //   dones: {},
    //   on_finish: on_fin,
    //   total: 0
    // });

  }); // === each

  on_fin();
  return true;
}
