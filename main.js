"use strict";
/* jshint undef: true */
/* global Mustache, promise  */

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
  if (is_localhost && window.console)
    return console.log.apply(console, arguments);

  return false;
} // === func

spec(to_string, [null], 'null');
spec(to_string, [undefined], 'undefined');
spec(to_string, [[1]], '[1]');
spec(to_string, ['yo yo'], '"yo yo"');
spec(to_string, [{a:'b', c:'d'}], '{a="b",c="d"}');
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

  if (is_plain_object(val)) {
    return '{' + _.reduce(_.keys(val), function (acc, k) {
      acc.push(k + '=' + to_string(val[k]));
      return acc;
    }, []).join(",") + '}';
  }

  if (is_function(val) && val.hasOwnProperty('to_string_name'))
    return val.to_string_name;

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

throws(
  should_be, [[1], is_num, is_num],
  'Wrong # of arguments: expected: 2 actual: 1'
);
function should_be(args_o, _funcs) {
  var funcs = _.toArray(arguments);
  var args  = funcs.shift();

  if (args.length !== funcs.length) {
    throw new Error('Wrong # of arguments: expected: ' + funcs.length + ' actual: ' + args.length);
  }

  for (var i = 0; i < funcs.length; i++) {
    if (!funcs[i](args[i]))
      throw new Error('Invalid arguments: ' + to_string(args[i]) + ' !' + to_string(funcs[i]));
  }

  return _.toArray(args);
}

// === Helpers ===================================================================

function apply_function(f, args) {
  should_be(arguments, length_of(args.length), is_array);
  return f.apply(null, args);
}

returns({a:{b:"c"}, b:true}, function () { // Does not alter orig.
  var orig = {a:{b:"c"}, b:true};
  var copy = copy_value(orig);
  copy.a.b = "1";
  return orig;
});
function copy_value(v) {
  should_be(arguments, is_something);
  var type = typeof v;
  if (type === 'string' || type === 'number' || is_bool(v))
    return v;

  if (is_array(v))
    return _.map(v, copy_value);

  if (is_plain_object(v))
    return reduce_eachs({}, v, function (acc, kx, x) {
      acc[kx] = copy_value(x);
      return acc;
    });

  throw new Error('Value can\'t be copied: ' + to_string(v));
}

spec(standard_name, ['n   aME'], 'n ame');
function standard_name(str) {
  return _.trim(str).replace(WHITESPACE, ' ').toLowerCase();
}

returns(
  {"class": 'is_happy'},
  function () {
    spec_dom().html('<div class="is_happy"></div>');
    return dom_attrs(spec_dom().find('div')[0]);
  }
);
function dom_attrs(dom) {
  should_be(arguments, has_property_of('attributes', 'object'));

  return _.reduce(
    dom.attributes,
    function (kv, o) {
      kv[o.name] = o.value;
      return kv;
    },
    {}
  );
} // === attrs

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
    throw new Error("Called with too few arguments: " + arguments.length);

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
  return function (v) {
    if (!is_something(v) && has_property_of('length', 'number')(v))
      throw new Error('invalid value for length_of: ' + to_string(num));
    return v.length === num;
  };
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

spec(is_something, [null],      false);
spec(is_something, [undefined], false);
spec(is_something, [[]],       true);
spec(is_something, [{}],       true);
spec(is_something, [{a: "c"}], true);
function is_something(v) {
  if (arguments.length !== 1)
    throw new Error("arguments.length !== 1: " + to_string(v));
  return !is_null(v) && !is_undefined(v);
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
  return function_to_name(f) + '(' + _.map(args, to_string).join(', ') + ')';
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
  if (!is_empty(target) && target !== href  && target !== function_to_name(str_or_func))
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

function function_sig(f, args) {
  return function_to_name(f) + '(' + _.map(args, to_string).join(',')  + ')';
}

function set_function_string_name(f, args) {
  if (f.to_string_name)
    throw new Error('.to_string_name alread set: ' + to_string(f.to_string_name));
  f.to_string_name = function_sig(f, args);
  return f;
}

function has_property_of(name, type) {
  var f = function has_property_of(o) {
    return typeof o[name] === type;
  };

  return set_function_string_name(f, arguments);
}

function has_own_property(name) {
  var f = function has_own_property(o) {
    return o.hasOwnProperty(name);
  };

  return set_function_string_name(f, arguments);
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

spec(function_to_name, ["function my_name() {}"], "my_name");
function function_to_name(f) {
  return f.to_string_name || f.toString().split('(')[0].split(WHITESPACE)[1] || f.toString();
}

spec(is_enumerable, [$('<p></p>')], true);
function is_enumerable(v) {
  return is_string(v) || is_array(v) || is_plain_object(v) || (v.hasOwnProperty('length') && v.constructor === $);
}

spec(l, [[1]], 1);
throws(l, [{}], '.length is {}.undefined');
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

function find_key(k, _args) {
  var args = _.toArray(arguments);
  args.shift();
  var o = _.detect(args, function (x) { return x.hasOwnProperty(k); });
  if (!o)
    throw new Error('Key, ' + to_string(k) + ', not found in any: ' + to_string(args));
  return o[k];
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
  state('push', id, function (msg) {a=a+1;});
  state('run', data); state('run', data); state('run', data);
  return a;
});
returns(1, function () {
  var a = 0, id = next_id('is_happy');
  var d_false = {}; d_false[id] = false;
  var d_true  = {}; d_true[id]  = true;
  var state = new Computer();
  state('push', '!' + id, function (msg) {a=a+1;});
  state('run', d_false);
  state('run', d_true);
  state('run', d_true);
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

      case 'push':
        var name=arguments[1], func= arguments[2];

        if (!is_string(name))
          throw new Error("'name' value invalid: " + to_string(name));
        if (!is_function(func))
          throw new Error("invalid value for function: " + to_string(func));
        if (func.length !== 1)
          throw new Error("function.length needs to === 1: " + function_to_name(func));
        if (!is_allowed(name))
          allow(name);

        State.funcs = funcs.slice(0).concat([{name: name, func: func}]);
        return true;

      case 'run':
        should_be(arguments, is('run'), is_plain_object).shift();
        var msg = arguments[1];

        return reduce_eachs([], msg, funcs, function (acc, data_key, x, _ky, meta) {
          if (!key_to_bool(meta.name, data_key, msg))
            return acc;
          try {
            acc.push([meta, meta.func(copy_value(msg))]);
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

} // === function Computer

function dum_show(data, dom_id) {
  $('#' + dom_id).show();
  return 'show: ' + dom_id;
}

function dum_hide(data, dom_id) {
  $('#' + dom_id).hide();
  return 'hide: ' + dom_id;
}

function dum_dom(data) {
  var selector = '*[data-dum]:not(*[data-dum_fin~="yes"])';
  var elements = $((data && data.target) || $('body')).find(selector).addBack(selector);

  var events = ['on_click', 'on_mousedown', 'on_mouseup', 'on_keypress'];

  eachs(elements, function (i, raw_e) {
    eachs($(raw_e).attr('data-dum').split(';'), function (_i, raw_cmd) {

      raw_cmd = _.trim(raw_cmd);
      if (is_empty(raw_cmd))
        return;

      var args = _.trim(raw_cmd).split(WHITESPACE);

      // === data-dum="on_dom_create_widget"
      if (l(args) === 1) {
        var prep_func = window[args[0]];
        if (!prep_func)
          throw new Error('func not found: ' + func);
        prep_func(dom_id($(raw_e)));
        return;
      }

      // === data-dum="is_name my_func"
      if (l(args) !== 2)
        throw new Error("Invalid command: " + to_string(args));

      var bool_name = args.shift();
      var func_name = args.shift();
      if (!window[func_name])
        func_name = 'dum_' + func_name;
      var func = name_to_function(func_name);
      var id   = dom_id($(raw_e));


      var is_event = _.detect(events, function (x) { return x === bool_name; });
      if (is_event) {
        $('#' + id).on(bool_name.replace('on_', ''), function () {
          var msg = {
            dom_id: id,
            is_event: true,
            event_name: bool_name
          };
          msg['on_' + bool_name] = true;
          App('run', msg);
        });
      }

      App('push', bool_name, function (msg) {
        if (msg.is_event) {
          if (msg.dom_id === id)
            return func(msg);
          else
            return 'does not apply: ' + bool_name + ' #' + msg.dom_id;
        } else
          return func(msg, id);
      });


    });
    $(raw_e).attr('data-dum_fin', 'yes');
  });

} // === dum_dom

returns(3, function () {
  spec_dom().html(
    '<script type="application/dum_template" data-dum="is_text template">'+
      '&lt;p&gt;1&lt;p&gt;' +
      '&lt;p&gt;2&lt;p&gt;' +
      '&lt;p&gt;3&lt;p&gt;' +
    '</script>'
  );
  App('run', {is_text: true});
  return spec_dom().find('p').length;
});
function dum_template(data, dom_id) {
  var this_name = "applet.template.mustache";
  if (o.name === 'this position')
    return 'top';

  var scripts = Applet.find(this_name, 'script[type^="text/mustache"]', o.target);

  if (scripts.length < 1)
    return;

  _.each(scripts, function (raw) {
    var t              = $(raw);
    var types          = t.attr('type').split('/');
    var html           = t.html();
    var placeholder_id = Applet.dom_id(t);
    var data_key       = types[2];
    var id             = Applet.dom_id(t, 'mustache_templates_' + (data_key || ''));
    var pos            = 'replace';

    Applet.mark_as_compiled(this_name, t);

    switch (_.trim(types[1])) {
      case 'mustache-top':
        pos = 'top';
        break;

      case 'mustache-bottom':
        pos = 'bottom';
        break;
    } // === switch type[1]

    var meta = {
      id             : id,
      key            : data_key,
      html           : html,
      mustache       : html,
      placeholder_id : placeholder_id,
      elements       : null,
      pos            : pos
    };

    o.applet.new_func(
      function (o, data) {
        if (o.name !== 'data' || !_.isPlainObject(data[meta.key]))
          return;

        // === Remove old nodes:
        if (meta.elements && meta.pos === 'replace') {
          meta.elements.remove();
        }

        var html = $(Mustache.render(meta.mustache, data));
        if (meta.pos === 'replace' || meta.pos === 'bottom')
          html.insertBefore($('#' + meta.placeholder_id));
        else
          html.insertAfter($('#' + meta.placeholder_id));

        meta.elements = html;
        o.applet.run({
          name   : 'dom',
          target : html
        });
      }
    ); // === new_func

  });

} // ==== funcs: template ==========


// ==== Integration tests======================================================
returns('', function () {
  spec_dom().html('<div data-dum="is_factor show" style="display: none;">Factor</div>');
  App('run', {dom: true});
  App('run', {is_factor: true});
  return spec_dom().find('div').attr('style');
});

// ============================================================================
if (is_localhost())
  log('============ Specs Finished ==========');

// log("THE_FILE_DATE");

// === Spec of specs
// spec - can compare the results when they are two arrays: [1] === [1]
