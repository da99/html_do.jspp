"use strict";

var WHITESPACE = /\s+/g;
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

// Returns id.
// Sets id of element if no id is set.
//
// .dom_id(raw_or_jquery)
// .dom_id('prefix', raw_or_jquer)
//
function dom_id() {
  var args   = _.toArray(arguments);
  var o      = _.find(args, _.negate(_.isString));
  var prefix = _.find(args, _.isString);
  var old    = o.attr('id');

  if (old && !is_empty(old))
    return old;

  var str = new_id(prefix || 'default_id_');
  o.attr('id', str);
  return str;
} // === id

// Examples:
//
//   .new_id()           ->  Integer
//   .new_id('prefix_')  ->  String
//
function new_id(prefix) {
  if (!new_id.hasOwnProperty('_id'))
    new_id._id = -1;
  new_id._id = new_id._id + 1;
  return (prefix) ? prefix + new_id._id : new_id._id;
} // === func

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

function is_plain_object(v) {
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
  if (_.isEqual(actual, expect))
    return to_string(actual) + ' === ' + to_string(expect);
  else
    return to_string(actual) + ' !== ' + to_string(expect);
}

function to_function_string(f, args) {
  return name_of_function(f) + '(' + _.map(args, to_string).join(', ') + ')';
}


function throws(f, args, expect) {
  if (!new_spec(f))
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

  if (_.isEqual(actual, expect)) {
    log('=== Passed: ' + sig + ' -> ' + expect);
    return true;
  }

  log('!!! Unexpected error for: ' + sig + ' -> ' + msg);
  throw err;
}

function returns(expect, f) {
  if (!new_spec(f))
    return false;

  if (!_.isFunction(f))
    throw new Error('Invalid value for func: ' + to_string(f));

  var sig = f.toString();
  var actual = f();
  var msg = to_match_string(actual, expect);
  if (!_.isEqual(actual,expect))
    throw new Error("!!! Failed: " + sig + ' -> ' + msg);
  log('=== Passed: ' + sig + ' -> ' + msg);
  return true;
}


spec(name_to_function, ["name_to_function"], name_to_function);
function name_to_function(raw) {
  if (!is_string(raw))
    throw new Error('Not a string: ' + to_string(raw));
  var str = _.trim(raw);
  if (!window[str])
    throw new Error('Function not found: ' + to_string(raw));
  return window[str];
}

function dum_dom(meta, data) {
  var selector = '*[data-dum]:not(*[data-dum_fin~="yes"])';
  var elements = $((data && data.target) || $('body')).find(selector).addBack(selector);

  eachs(elements, function (i, raw_e) {
    eachs($(raw_e).attr('data-dum').split(';'), function (_i, raw_cmd) {
      raw_cmd = _.trim(raw_cmd);
      if (is_empty(raw_cmd))
        return;

      var args = _.trim(raw_cmd).split(WHITESPACE);

      if (l(args) !== 2)
        throw new Error("Invalid command: " + to_string(args));

      var bool_name = args.shift();
      var func      = name_to_function(args.shift());

      App('push', bool_name, function (meta, data) {
        meta.dom_id = dom_id($(raw_e));
        return func(meta, data);
      });
    });
    $(raw_e).attr('data-dum_fin', 'yes');
  });

} // === dum_dom

function App() {
  var is_reset = arguments.length === 1 && arguments[0] === 'reset for specs';
  if (!App.hasOwnProperty('_state') || is_reset) {
    var c = App._state = new Computer();
    c('push', 'dom', dum_dom); // push dom func
  } // === if !_state

  if (!is_reset)
    App._state.apply(null, arguments);

  return App;
}


function new_spec(str_or_func) {
  if (!is_localhost())
    return false;

  // === Is there a specific spec to run?
  var href = window.location.href;
  var target = _.trim(href.split('?').pop() || '');
  if (!is_empty(target) && target !== href  && target !== name_of_function(str_or_func))
    return false;

  // === Reset DOM:
  spec_dom('reset');

  // === Reset App state:
  App('reset for specs');

  return true;
}


function spec_dom(cmd) {

  switch (cmd) {
    case 'reset':
      var stage = $('#The_Stage');
      if (stage.length === 0)
        $('body').prepend('<div id="The_Stage"></div>');
      else
        stage.empty();
      break;

    default:
      if (arguments.length !== 0)
      throw new Error("Unknown value: " + to_string(arguments));
  } // === switch cmd

  return $('#The_Stage');
}

function spec(f, args, expect) {
  if (!new_spec(f))
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

spec(is_enumerable, [$('<p></p>')], true);
function is_enumerable(v) {
  return is_string(v) || is_array(v) || is_plain_object(v) || (v.hasOwnProperty('length') && v.constructor === $);
}

spec(l, [[1]], 1);
throws(l, [{}], '.length is [object Object].undefined');
function l(v) {
  if (!is_enumerable(v))
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

function keys_or_indexes(v) {
  if (is_plain_object(v))
    return _.keys(v);

  var a = [];
  for(var i = 0; i < v.length; i++) {
    a[i] = i;
  }
  return a;
}



// TODO: spec: does not modify arr
spec(reduce_eachs, [
  [], [1,2], function (v, kx, x) { v.push("" + kx + x); return v; }
], ["01", "12"]);

spec(reduce_eachs, [
  [], [1,2], ["a", "b"], function (v, kx, x, ky, y) { v.push("" + x + y); return v; }
], ["1a", "1b", "2a", "2b"]);

spec(reduce_eachs, [
  [], {one: 1, two: 2}, ["a"], function (v, kx, x, ky, y) { v.push("" + kx + y); return v; }
], ["onea", "twoa"]);

spec(reduce_eachs, [
  [], {one: 1, two: 2}, [], ["a"], function (v, kx, x, ky, y, kz, z) { v.push("" + kx + y); return v; }
], []);
function reduce_eachs() {
  var args = _.toArray(arguments);
  if (args.length < 3)
    throw new Error("Not enough args: " + to_string(args));
  var init = args.shift();
  var f    = args.pop();

  // === Validate inputs before continuing:
  for (var i = 0; i < args.length; i++) {
    if (!is_enumerable(args[i]))
        throw new Error("Invalid value for reduce_eachs: " + to_string(args[i]));
  }

  if (is_undefined(init))
    throw new Error("Invalid value for init: " + to_string(init));


  // === Process inputs:
  var cols_length = l(args);

  return row_maker([init], 0, _.map(args, keys_or_indexes));

  function row_maker(row, col_i, key_cols) {
    if (col_i >= cols_length) {
      if (row.length !== f.length)
        throw new Error("f.length (" + f.length + ") should be " + row.length + " (collection count * 2 + 1 (init))");
      row[0] = f.apply(null, [].concat(row)); // set reduced value
      return row[0];
    }

    var keys = key_cols[col_i].slice(0);
    var vals = args[col_i];
    ++col_i;

    for(var i = 0; i < keys.length; i++) {
      row.push(keys[i]); // key
      row.push(vals[keys[i]]); // actual value

      row_maker(row, col_i, key_cols);

      row.pop();
      row.pop();
    }

    return row[0];
  }
} // === function: reduce_eachs


// TODO: spec :eachs does not alter inputs
returns(
  ["01", "12"],
  function () {
    var v = [];
    eachs( [1,2], function (kx, x) { v.push("" + kx + x); });
    return v;
  }
);

returns(
  ["1a", "1b", "2a", "2b"],
  function () {
    var v = [];
    eachs( [1,2], ["a", "b"], function (kx, x, ky, y) { v.push("" + x + y); });
    return v;
  }
);

returns(
  ["onea", "twoa"],
  function () {
    var v = [];
    eachs({one: 1, two: 2}, ["a"], function (kx, x, ky, y) { v.push("" + kx + y); });
    return v;
  }
);

returns(
  ["1a", "1b", "2a", "2b"],
  function () {
    var v = [];
    eachs({one: 1, two: 2}, ["a", "b"], function (kx, x, ky, y) { v.push("" + x + y); });
    return v;
  }
);


returns(
  [],
  function () {
    var v = [];
    eachs({one: 1, two: 2}, [], ["a"], function (kx, x, ky, y, kz, z) { v.push("" + kx + y); });
    return v;
  }
);
function eachs() {
  var args = _.toArray(arguments);
  if (args.length < 2)
    throw new Error("Not enough args: " + to_string(args));
  var f    = args.pop();

  // === Validate inputs before continuing:
  for (var i = 0; i < args.length; i++) {
    if (!is_enumerable(args[i]))
        throw new Error("Invalid value for eachs: " + to_string(args[i]));
  }

  // === Process inputs:
  var cols_length = l(args);

  return row_maker([], 0, _.map(args, keys_or_indexes));

  function row_maker(row, col_i, key_cols) {
    if (col_i >= cols_length) {
      if (row.length !== f.length)
        throw new Error("f.length (" + f.length + ") should be " + row.length + " (collection count * 2 )");
      f.apply(null, [].concat(row)); // set reduced value
      return;
    }

    var keys = key_cols[col_i].slice(0);
    var vals = args[col_i];
    ++col_i;

    for(var i = 0; i < keys.length; i++) {
      row.push(keys[i]); // key
      row.push(vals[keys[i]]); // actual value

      row_maker(row, col_i, key_cols);

      row.pop();
      row.pop();
    }

    return;
  }
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

// ========================= Computer
returns(3, function () {
  var a = 0, id = next_id('is_happy');
  var data = {}; data[id] = true;
  var state = new Computer();
  state('push', id, function () {a=a+1;});
  state('run', 'data', data); state('run', 'data', data); state('run', 'data', data);
  return a;
});
returns(1, function () {
  var a = 0, id = next_id('is_happy');
  var d_false = {}; d_false[id] = false;
  var d_true  = {}; d_true[id]  = true;
  var state = new Computer();
  state('push', '!' + id, function () {a=a+1;});
  state('run', 'data', d_false);
  state('run', 'data', d_true);
  state('run', 'data', d_true);
  return a;
});

function Computer() {
  State.allowed = ['data'];
  return State;

  function allow(raw_name) {
    var name = _.trimLeft(raw_name, '!');
    State.allowed.push(name);
    return name;
  }

  function is_allowed(raw_name) {
    var name = _.trimLeft(raw_name, '!');
    return _.detect(State.allowed, function (x) { return x === name; });
  }

  function State(action, args) {
    if (State.is_invalid === true)
      throw new Error("state is invalid.");

    if (action === 'invalid') {
      State.is_invalid = true;
      return;
    }

    if(!is_array(State.funcs || 'none'))
      State.funcs = [];
    var funcs = State.funcs.slice(0);

    switch (action) {
      case 'allow':
        var new_actions = _.flattenDeep( [_.toArray(arguments)] );
        State.allowed = [].concat(State.allowed).concat(new_actions);
        break;

      case 'run':
        var target = arguments[1];
        var data;
        if (arguments.length === 2) {
          data = {};
          data[target] = true;
        } else
          data = arguments[2];

        var allowed = State.allowed;
        if (!is_allowed(target))
          throw new Error(to_string(target) + ' is  not allowed: ' + to_string(allowed));

        return reduce_eachs([], data, funcs, function (acc, data_key, x, _ky, meta) {
          if (!key_to_bool(meta.name, data_key, data))
            return acc;
          try {
            acc.push([meta, meta.func(meta, data)]);
          } catch (e) {
            State('invalid');
            throw e;
          }

          return acc;
        });

      case 'push':
        var name=arguments[1], func= arguments[2];

        if (!is_string(name))
          throw new Error("'name' value invalid: " + to_string(name));
        if (!is_function(func))
          throw new Error("invalid value for function: " + to_string(func));

        if (!is_allowed(name))
          allow(name);

        State.funcs = funcs.slice(0).concat([{name: name, func: func}]);
        return true;

      default:
        State('invalid');
        throw new Error("Unknown action for state: " + to_string(action));
    } // === switch action
  } // === return function State;

} // === function Computer

function show(meta, data) {
  $('#' + meta.dom_id).show();
  return 'show: ' + meta.dom_id;
}

function hide(meta, data) {
  $('#' + meta.dom_id).hide();
  return 'hide: ' + meta.dom_id;
}

returns('', function () {
  spec_dom().html('<div data-dum="is_factor show" style="display: none;">Factor</div>');
  App('run', 'dom');
  App('run', 'data', {is_factor: true});
  return spec_dom().find('div').attr('style');
});

// ============================================================================
if (is_localhost())
  log('============ Specs Finished ==========');

// log("THE_FILE_DATE");

// === Spec of specs
// spec - can compare the results when they are two arrays: [1] === [1]
