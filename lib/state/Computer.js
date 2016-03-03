/* jshint strict: true, undef: true */
/* globals is_array, spec, arguments_are, reduce_eachs, copy_value, do_it, and, is, is_plain_object */
/* globals is_string, be, not, to_string, apply_function, has_length, is_function, msg_match, function_to_name */
/* globals reduce, log, exports, is_something, is_empty, _ */
/* globals or, is_num, is_array_of_functions, to_key, is_null, is_undefined, is_regexp, is_error, is_arguments */

spec(function throws_on_invalid() {
  "use strict";
  var comp = new Computer();
  comp('create', 'a number', 1, function (msg) { return be(is_num, msg.value); });
  comp('update', 'a number', '2');
}, [], /2. should be: is_num /);

spec(2, function increments_counter() {
  "use strict";
  var comp = new Computer();
  comp('create', 'counter', 0);
  comp('+1', 'counter');
  comp('+1', 'counter');
  return comp('read', 'counter');
});

spec(-4, function decrements_counter() {
  "use strict";
  var comp = new Computer();
  comp('create', 'counter', -2);
  comp('-1', 'counter');
  comp('-1', 'counter');
  return comp('read', 'counter');
});

spec(3, function runs_message_function() {
  "use strict";

  var counter = 0;
  var data = {my_name: 'happy'};
  var state = new Computer();
  state('create message function', function (msg) {
    if (!msg_match({my_name: 'happy'}, msg))
      return;
    ++counter;
  });
  do_it(3, function () { state('send message', data); });
  return counter;
});

exports.Computer = Computer;
function Computer() {
  "use strict";

  ME.values     = {};
  ME.msg_funcs  = [];
  ME.abouts     = {};
  return ME;

  function _save_(action, name, val) {
    var fin = reduce_eachs(val, ME.abouts[name], function (val, _i, cleaner) {
      return cleaner({action: action, name: name, value: val});
    });
    ME.values[name] = fin;
    return _read_and_copy_key_(name);
  }

  function _read_and_copy_key_(k) {
    var key = _require_key_(k);
    return _copy_value_(ME.values[key]);
  }

  function _copy_value_(v) {
    return copy_value(v, is_function, is_null, is_undefined, is_error, is_arguments, is_regexp);
  }

  function _replace_with_copy_(raw) {
    var key = _require_key_(raw);
    ME.values[key] = _copy_value_(ME.values[key]);
    return ME.values[key];
  }

  function _has_key_(k) {
    return ME.values.hasOwnProperty(to_key(k));
  }

  function _update_(k, func) {
  }

  function _key_must_not_exist_(k) {
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

  function ME(action, args) {
    if (action === 'invalid') {
      ME.is_invalid = true;
      return;
    }

    if (ME.is_invalid === true)
      throw new Error("state is invalid.");

    var name, new_abouts, new_args, key, func, funcs, tail, new_val, old_vals, default_val, old;

    var msg_funcs = ME.msg_funcs.slice(0);

    switch (action) {
      case 'create message function':
         func = be(and(is_function, has_length(1)), arguments[1]);

        ME.msg_funcs = msg_funcs.slice(0).concat([func]);
        return true;

      case 'push into or create':
        name = to_key(arguments[1]);
        if (!_has_key_(name))
          ME('create', name, []);
        new_args = ['push into'].concat(_.toArray(arguments).slice(1));
        return ME.apply(null, new_args);

      case 'push into':
        name    = _require_key_(arguments[1]);
        new_val = reduce(arguments[2], be(is_something));
        return _replace_with_copy_(name).push(new_val);

      case 'read':
        name = reduce(arguments[1], be(is_string), _.trim, be(not(is_empty)));

        var val_has_been_set = is_something(ME.values[name]);
        var has_default_val  = arguments.length > 2;
        default_val      = has_default_val && be(is_something, arguments[2]);

        if (!val_has_been_set && !has_default_val)
          throw new Error('Not set: ' + to_string(name));

        if (val_has_been_set)
          return _copy_value_(ME.values[name]);
        return default_val;

      case 'create':
        name = _key_must_not_exist_(arguments[1]);
        new_abouts = _.toArray(arguments).slice(3);
        if (is_empty(new_abouts))
          ME.abouts[name] = [];
        else
          ME.abouts[name] = be( is_array_of_functions, new_abouts );

        return _save_('create', name, reduce(arguments[2], be(is_something)));

      case 'read or create':
        name = to_key(arguments[1]);
        tail = _.toArray(arguments).slice(2);
        if (_has_key_(name))
          return ME('read', name);
        return ME.apply(null, ['create', name].concat(tail));

      case 'read and update':
        key  = _require_key_(arguments[1]);
        func = be(is_function, arguments[2]);
        old  = ME('read', key);
        return ME('update', key, func(old));

      case 'update':
        if (arguments.length !== 3)
          throw new Error('Wrong # of arguments: ' + to_string(arguments));
        return _save_('update', _require_key_(arguments[1]), arguments[2]);

      case '+1':
        return ME('read and update', arguments[1], function (old) {
          return be(is_num, old) + 1;
        });

      case '-1':
        return ME('read and update', arguments[1], function (old) {
          return be(is_num, old) - 1;
        });

      case 'send message':
        arguments_are(arguments, is('send message'), is_plain_object);
        var msg = arguments[1];

        return reduce_eachs([], msg_funcs, function (acc, _ky, func) {
          try {
            var msg_copy = _copy_value_(msg);
            acc.push( apply_function(func, [msg_copy]));
          } catch (e) {
            ME('invalid');
            throw e;
          }

          return acc;
        });

      default:
        ME('invalid');
        throw new Error("Unknown action for state: " + to_string(action));
    } // === switch action
  } // === return function State;

} // === function Computer =====================================================
