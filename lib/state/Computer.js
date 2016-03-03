/* jshint strict: true, undef: true */
/* globals is_array, spec, arguments_are, reduce_eachs, copy_value, do_it, and, is, is_plain_object */
/* globals is_string, be, not, to_string, apply_function, has_length, is_function, msg_match, function_to_name */
/* globals reduce, log, exports, is_something, is_empty, _ */
/* globals to_key, is_null, is_undefined, is_regexp, is_error, is_arguments */

spec(3, function runs_message_function() {
  "use strict";

  var counter = 0;
  var data = {my_name: 'happy'};
  var state = new Computer();
  state('insert message function', function (msg) {
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

  State.values     = {};
  State.msg_funcs  = [];
  return State;

  function _read_and_copy_key_(k) {
    var key = _require_key_(k);
    return _copy_value_(State.values[key]);
  }

  function _copy_value_(v) {
    return copy_value(v, is_function, is_null, is_undefined, is_error, is_arguments, is_regexp);
  }

  function _replace_with_copy_(raw) {
    var key = _require_key_(raw);
    State.values[key] = _copy_value_(State.values[key]);
    return State.values[key];
  }

  function _has_key_(k) {
    return State.values.hasOwnProperty(to_key(k));
  }

  function _require_key_is_new_(k) {
    var key = to_key(k);
    if (_has_key_(key))
      throw new Error("Value already created: " + to_string(key));
    return key;
  }

  function _require_key_(k) {
    var key = to_key(k);
    if (!_has_key_(key))
      throw new Error("Value has not been created: " + to_string(k));
    return key;
  }

  function State(action, args) {
    if (action === 'invalid') {
      State.is_invalid = true;
      return;
    }

    if (State.is_invalid === true)
      throw new Error("state is invalid.");

    var name, new_val, old_vals, default_val;

    var msg_funcs = State.msg_funcs.slice(0);

    switch (action) {
      case 'insert message function':
        var func = be(and(is_function, has_length(1)), arguments[1]);

        State.msg_funcs = msg_funcs.slice(0).concat([func]);
        return true;

      case 'push into or create':
        name = to_key(arguments[1]);
        if (!_has_key_(name))
          State('insert', name, []);
        var new_args = ['push into'].concat(_.toArray(arguments).slice(1));
        return State.apply(null, new_args);

      case 'push into':
        name    = _require_key_(arguments[1]);
        new_val = reduce(arguments[2], be(is_something));
        return _replace_with_copy_(name).push(new_val);

      case 'read':
        name = reduce(arguments[1], be(is_string), _.trim, be(not(is_empty)));

        var val_has_been_set = is_something(State.values[name]);
        var has_default_val  = arguments.length > 2;
        default_val      = has_default_val && be(is_something, arguments[2]);

        if (!val_has_been_set && !has_default_val)
          throw new Error('Not set: ' + to_string(name));

        if (val_has_been_set)
          return _copy_value_(State.values[name]);
        return default_val;

      case 'insert':
        name = _require_key_is_new_(arguments[1]);
        State.values[name] = reduce(arguments[2], be(is_something));
        return _read_and_copy_key_(name);

      case 'read or insert':
        name        = to_key(arguments[1]);
        default_val = reduce(arguments[2], be(is_something));
        if (!_has_key_(name))
          State('insert', name, default_val);
        return _read_and_copy_key_(name);

      case 'read counter':
        return _read_and_copy_key_(arguments[1]);

      case 'run':
        arguments_are(arguments, is('run'), is_plain_object);
        var msg = arguments[1];

        return reduce_eachs([], msg_funcs, function (acc, _ky, func) {
          try {
            var msg_copy = _copy_value_(msg);
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
