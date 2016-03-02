/* jshint strict: true, undef: true */
/* globals is_array, spec, arguments_are, reduce_eachs, copy_value, do_it, and, is, is_plain_object */
/* globals is_string, be, not, to_string, apply_function, has_length, is_function, msg_match, function_to_name */
/* globals reduce, log, exports, is_something, is_empty, _ */
/* globals is_null, is_undefined, is_regexp, is_error, is_arguments */

spec(3, function () {
  "use strict";

  var counter = 0;
  var data = {my_name: 'happy'};
  var state = new Computer();
  state('push', function (msg) {
    if (!msg_match({my_name: 'happy'}, msg))
      return;
    ++counter;
  });
  do_it(3, function () { state('run', data); });
  return counter;
});

exports.Computer = Computer;
function Computer() {
  "use strict";

  return State;

  function State(action, args) {
    if (action === 'invalid') {
      State.is_invalid = true;
      return;
    }

    var name, old_vals;

    if (State.is_invalid === true)
      throw new Error("state is invalid.");

    if(!is_array(State.funcs))
      State.funcs = [];

    var funcs = State.funcs.slice(0);

    switch (action) {
      case 'push into':
        arguments_are(arguments, is('push into'), is_string, is_something);
        name = be(not(is_empty), _.trim(arguments[1]));
        var new_val = arguments[2];
        if (!is_something(State.values))
          State.values = {};
        if (!is_something(State.values[name]))
            State.values[name] = [];
        old_vals = State.values[name];
        State.values[name] = ([]).concat(old_vals).concat([new_val]);
        return true;

      case 'get':
        var vals = State.values || {};
        name = reduce(arguments[1], be(is_string), _.trim, be(not(is_empty)));

        var val_has_been_set = is_something(State.values) && is_something(State.values[name]);
        var has_default_val  = arguments.length > 2;
        var default_val      = has_default_val && be(is_something, arguments[2]);

        if (!val_has_been_set && !has_default_val)
          throw new Error('Not set: ' + to_string(name));

        // log(copy_value(State.values[name], is_function, is_null, is_undefined, is_error, is_arguments, is_regexp) );
        if (val_has_been_set)
          return copy_value(State.values[name], is_function, is_null, is_undefined, is_error, is_arguments, is_regexp);
        return default_val;

      case 'push':
        arguments_are(arguments, is('push'), and(is_function, has_length(1)));
        var func = arguments[1];

        if (func.length !== 1)
          throw new Error("function.length needs to === 1: " + function_to_name(func));

        State.funcs = funcs.slice(0).concat([func]);
        return true;

      case 'run':
        arguments_are(arguments, is('run'), is_plain_object);
        var msg = arguments[1];

        return reduce_eachs([], funcs, function (acc, _ky, func) {
          try {
            var msg_copy = copy_value(msg);
            acc.push( apply_function(func, [msg_copy]));
          } catch (e) {
            State('invalid');
            throw e;
          }

          return acc;
        });

      default:
        State('invalid');
        throw new Error("Unknown action for state: " + to_string(action));
    } // === switch action
  } // === return function State;

} // === function Computer =====================================================
