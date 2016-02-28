/* jshint strict: true, undef: true */
/* globals is_array, spec_returns, arguments_are, reduce_eachs, copy_value, do_it, and, is, is_plain_object */
/* globals to_string, apply_function, has_length, is_function, msg_match, function_to_name */



spec_returns(3, function () {
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

function Computer() {
  "use strict";

  return State;

  function State(action, args) {
    if (action === 'invalid') {
      State.is_invalid = true;
      return;
    }

    if (State.is_invalid === true)
      throw new Error("state is invalid.");

    if(!is_array(State.funcs))
      State.funcs = [];
    var funcs = State.funcs.slice(0);

    switch (action) {
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
