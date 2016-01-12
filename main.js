"use strict";

function identity() { return _.identity.call(_, arguments); }

spec(is_localhost, [], window.location.href.indexOf('/dum_dum_boom_boom/example.html') > 0);
function is_localhost() {
  var addr = window.location.href;
  return window.console && (addr.indexOf("localhost") > -1 ||
    addr.indexOf("file:///") > -1 ||
    addr.indexOf("127.0.0.1") > -1)
  ;
} // === func

function log(_args) {
  if (is_localhost)
    return console.log.apply(console, arguments);

  return false;
} // === func

spec(to_string, [null], 'null');
spec(to_string, [undefined], 'undefined');
spec(to_string, [[1]], '[1]');
spec(to_string, ['yo yo'], '"yo yo"');
function to_string(val) {
  if (val === null)
    return "null";

  if (val === undefined)
    return "undefined";

  if (_.isArray(val))
    return  '['+_.map(val, to_string).join(", ") + ']';

  if (_.isString(val))
    return '"' + val + '"';

  if (or(is(0), is_positive)(val.length) && val.hasOwnProperty('callee'))
    return to_string(_.toArray(val));

  return val.toString();
} // === func


spec(is_array_of_functions, [[function () {}]], true);
spec(is_array_of_functions, [[]], false);
spec(is_array_of_functions, [[1]], false);
spec(is_array_of_functions, [1], false);
function is_array_of_functions(a) {
  return _.isArray(a) && l(a) > 0 && _.all(a, _.isFunction);
} // === func

returns(true,  function () { return is(5)(5); });
returns(false, function () { return is("a")("b"); });
function is(target) { return function (v) { return v === target; }; }

function is_positive(v) { return typeof v === 'number' && isFinite(v) && v > 0; }


function is_$(v) {
  return v && typeof v.html === 'function' && typeof v.attr === 'function';
}

function to_arg(val) { return function (f) { return f(val); }; }


// === Helpers ===================================================================

function is_anything(v) {
  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  if (v === null)
    throw new Error("'null' found.");
  if (v === undefined)
    throw new Error("'undefined' found.");

  return true;
}

function is_function(v) {
  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  return typeof v === 'function';
}

function conditional(name, funcs) {
  if (funcs.length < 2)
    throw new Error("Called 'or' with few arguments: " + arguments.length);

  if (!_[name])
    throw new Error("_." + name + " does not exist.");

  return function (v) {
    return _[name](funcs, function (f) { return f(v); });
  };
}

function and(_funcs) {
  return conditional('all', arguments);
}

function or(_funcs) {
  return conditional('any', arguments);
}

function length_of(num) {
  return function (v) { return v.length === num; };
}

function length_gt(num) {
  return function (v) { return v.length > num;};
}

function is_string(v) { return typeof v === "string"; }
function is_array(v) { return  _.isArray(v); }
function is_bool(v) { return _.isBoolean(v); }


function is_empty(v) {
  var l = v.length;
  if (!_.isFinite(l))
    throw new Error("!!! Invalid .length property.");

  return l === 0;
} // === func


function all_funcs(arr) {
  var l = arr.length;
  return _.isFinite(l) && l > 0 && _.all(arr, _.isFunction);
}

function is_num(v) {
  return typeof v === 'number' && isFinite(v);
}

function is_null(v) {
  return v === undefined;
}

function is_undefined(v) {
  return v === null;
}

function is_object(v) {
  return _.isPlainObject(v);
}

function return_arguments() { return arguments; }

spec(is_empty, [[]], true);
spec(is_empty, [{}], true);
spec(is_empty, [""], true);
spec(is_empty, [{a: "c"}], false);
spec(is_empty, [[1]],      false);
spec(is_empty, ["a"],      false);
spec(is_empty, [return_arguments()],      true);
spec(is_empty, [return_arguments(1,2,3)], false);
throws(is_empty, [null],   'invalid value for is_empty: null');
function is_empty(v) {
  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));

  if (!is_nothing(v) && v.hasOwnProperty('length'))
    return v.length === 0;

  if (_.isPlainObject(v))
    return _.keys(v).length === 0;

  throw new Error("invalid value for is_empty: " + to_string(v));
}

spec(is_nothing, [null],      true);
spec(is_nothing, [undefined], true);
spec(is_nothing, [[]],       false);
spec(is_nothing, [{}],       false);
spec(is_nothing, [{a: "c"}], false);
function is_nothing(v) {
  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));
  return or(is_null, is_undefined)(v);
}

function to_match_string(actual, expect) {
  if (actual === expect)
    return to_string(actual) + ' === ' + to_string(expect);
  else
    return to_string(actual) + ' !== ' + to_string(expect);
}

function to_function_string(f, args) {
  return name_of_function(f) + '(' + _.map(args, to_string).join(', ') + ')';
}


function throws(f, args, expect) {
  if (!is_localhost())
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));
  if (!_.isArray(args))
    throw new Error('Invalid value for args: ' + to_string(args));
  if (!_.isString(expect))
    throw new Error('Invalid valie for expect: ' + to_string(expect));

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

  if (actual === expect) {
    log('=== Passed: ' + sig + ' -> ' + expect);
    return true;
  }

  log('!!! Unexpected error for: ' + sig + ' -> ' + msg);
  throw err;
}

function returns(expect, f) {
  if (!is_localhost())
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  var sig = f.toString();
  var actual = f();
  var msg = to_match_string(actual, expect);
  if (actual!== expect)
    throw new Error("!!! Failed: " + sig + ' -> ' + msg);
  log('=== Passed: ' + sig + ' -> ' + msg);
  return true;
}

function spec(f, args, expect) {
  if (!is_localhost())
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  if (arguments.length !== 3)
    throw new Error("arguments.length invalid for spec: " + to_string(arguments.length));

  var sig    = to_function_string(f, args);
  var actual = f.apply(null, args);
  var msg    = to_match_string(actual, expect);

  if (actual !== expect && !_.isEqual(actual, expect))
    throw new Error("!!! Failed: " + sig + ' -> ' + msg );

  log('=== Passed: ' + sig + ' -> ' + msg);
  return true;
}

spec(name_of_function, ["function my_name() {}"], "my_name");
function name_of_function(f) {
  var name = f.toString().split('(')[0].split(' ')[1];
  return name || f.toString();
}

spec(l, [[1]], 1);
throws(l, [{}], '.length is [object Object].undefined');
function l(v) {
  if (!v)
    throw new Error('invalid value for l(): ' + to_string(v));

  var num = v.length;
  if (!or(is(0), is_positive)(num))
    throw new Error('.length is ' + to_string(v) + '.' + to_string(num));
  return num;
}

spec(is_length, [[1,2,3], 3], true);
function is_length(v, num) {
  return l(v) === num;
}

spec(is_anything, [false], true);
spec(is_anything, [true], true);
throws(is_anything, [null], 'null found');
throws(is_anything, [undefined], 'undefined found');
function is_anything(v) {
  if (v === null)
    throw new Error('null found');
  if (typeof v === 'undefined')
    throw new Error('undefined found');
  return true;
}

// === When actual value is: true
spec(key_to_bool, ['is_happy',  'is_happy', {is_happy: true}], true);
spec(key_to_bool, ['!is_happy', 'is_happy', {is_happy: true}], false);
// === When actual value is: false
spec(key_to_bool, ['is_happy',  'is_happy', {is_happy: false}], false);
spec(key_to_bool, ['!is_happy', 'is_happy', {is_happy: false}], true);
function key_to_bool(target, key, data) {
  if (!data.hasOwnProperty(key))
    return false;
  var actual = data[key];
  if (!is_bool(actual))
    return false;

  if (target === key)
    return actual;

  var not_key = '!' + key;
  if (target === not_key)
    return !actual;

  return false;
}

spec(reduce_each_x_each_y, [
  [], [1,2], ["a", "b"], function (v, kx, x, ky, y) { v.push("" + x + y); return v; }
], ["1a", "1b", "2a", "2b"]);
function reduce_each_x_each_y(init, xs, ys, f) {
  if (is_undefined(init))
    throw new Error("invalid value for init: " + to_string(init));
  if (arguments.length !== 4)
    throw new Error("arguments.length !== 4: " + to_string(arguments.length));
  if (f.length !== 5)
    throw new Error("function.length has to be 5: " + to_string(f));
  var v = init;
  _.each(xs, function (x, kx) {
    _.each(ys, function (y, ky) {
      v = f(v, kx, x, ky, y);
    });
  });
  return v;
}
function each_x_each_y(xs, ys, f) {
  _.each(xs, function (x, kx) {
    _.each(ys, function (y, ky) {
      f(kx, x, ky, y);
    });
  });
  return true;
}

function pipe_line() {
  var val, i = 0, f;
  var l = arguments.length;
  while (i < l) {
    f = arguments[i];
    if (i === 0)
      val = f();
    else
      val = f(val);
    i = i + 1;
  }
  return val;
}

function next_id() {
  if (!is_num(next_id.count))
    next_id.count = -1;
  next_id.count = next_id.count + 1;
  if (is_empty(arguments))
    return next_id.count;
  return arguments[0] + '_' + next_id.count;
}

returns(3, function () {
  var a = 0, id = next_id('is_happy');
  var data = {}; data[id] = true;
  state('push', id, function () {a=a+1;});
  state('run', data); state('run', data); state('run', data);
  return a;
});
returns(1, function () {
  var a = 0, id = next_id('is_happy');
  var d_false = {}; d_false[id] = false;
  var d_true  = {}; d_true[id]  = true;
  state('push', '!' + id, function () {a=a+1;});
  state('run', d_false);
  state('run', d_true);
  state('run', d_true);
  return a;
});
function state(action, args) {
  if (action === 'invalid')
    state.is_invalid = true;

  if (state.is_invalid === true)
    throw new Error("state is invalid.");

  if(!is_array(state.funcs || 'none'))
    state.funcs = [];
  var funcs = state.funcs.slice(0);

  switch (action) {
    case 'run':
      var data = arguments[1];

      return reduce_each_x_each_y([], data, funcs, function (acc, data_key, x, ky, meta) {
        if (!key_to_bool(meta.name, data_key, data))
          return acc;
        try {
          acc.push([meta, meta.func(meta, data)]);
        } catch (e) {
          state('invalid');
          throw e;
        }

        return acc;
      });

    case 'push':
      var name=arguments[1], func= arguments[2];

      if (!is_string(name))
        throw new Error("'name' value invalid: " + to_string(name));
      if (!is_function(func))
        throw new Error("'func' value invalid: " + to_string(func));

      state.funcs = funcs.slice(0).concat([{name: name, func: func}]);
      return true;

    default:
      state('invalid');
      throw new Error("Unknown action for state: " + to_string(action));
  } // === switch action
}

// ============================================================================

log('============ Specs Finished ==========');
log("THE_FILE_DATE");


// === Spec of specs
// spec - can compare the results when they are two arrays: [1] === [1]
