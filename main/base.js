
function apply_function(f, args) {
  if (arguments.length !== 2)
    throw new Error('Wrong # of argumments: expected: ' + 2 + ' actual: ' + arguments.length);
  if (!is_array(args) && !is_arguments(args))
    throw new Error('Not an array/arguments: ' + to_string(args));
  if (f.length !== args.length)
    throw new Error('function.length (' + function_to_name(f) + ' ' + f.length + ') !== ' + args.length);
  return f.apply(null, args);
}


spec(merge, [{a: [1]}, {a: [2,3]}], {a: [1,2,3]});
spec(merge, [[1], [2,3]], [1,2,3]);
spec(merge, [{a: 1}, {b: 2}, {c: 3}], {a: 1, b: 2, c: 3});
function merge(_args) {
  if (arguments.length === 0)
    throw new Error('Arguments misisng.');
  var type = is_array(arguments[0]) ? 'array' : 'plain object';
  var fin  = (type === 'array') ? [] : {};
  eachs(arguments, function (kx,x) {
    if (type === 'array' && !is_array(x))
      throw new Error('Value needs to be an array: ' + to_string(x));
    if (type === 'plain object'  && !is_plain_object(x))
      throw new Error('Value needs to be a plain object: ' + to_string(x));

    eachs(x, function (key, val) {
      if ( type === 'array' ) {
        fin.push(val);
        return;
      }

      if (fin[key] === val || !fin.hasOwnProperty(key)) {
        fin[key] = val;
        return;
      }

      if (is_array(fin[key]) && is_array(val)) {
        fin[key] = [].concat(fin[key]).concat(val);
        return;
      }

      if (is_plain_object(fin[key]) && is_plain_object(val))  {
        fin[key] = merge(fin[key], val);
        return;
      }

      throw new Error('Could not merge key: [' + to_string(key) +  '] ' + to_string(fin[key]) + ' -> ' + to_string(val) );

    }); // === eachs
  });

  return fin;
}

spec_returns({a:{b:"c"}, b:true}, function () { // Does not alter orig.
  var orig = {a:{b:"c"}, b:true};
  var copy = copy_value(orig);
  copy.a.b = "1";
  return orig;
});
function copy_value(v) {
  arguments_are(arguments, is_something);
  var type = typeof v;
  if (type === 'string' || type === 'number' || is_bool(v))
    return v;

  if (is_array(v))
    return _.map(v, function (v) { return copy_value(v); });

  if (is_plain_object(v))
    return reduce_eachs({}, v, function (acc, kx, x) {
      acc[kx] = copy_value(x);
      return acc;
    });

  throw new Error('Value can\'t be copied: ' + to_string(v));
}


spec(standard_name, ['NAME NAME'], "name name");     // it 'lowercases names'
spec(standard_name, ['  name  '],  'name');          // it 'trims string'
spec(standard_name, ['n   aME'],   'n ame');         // it 'squeezes whitespace'
function standard_name(str) {
  var WHITESPACE = /\s+/g;
  return _.trim(str).replace(WHITESPACE, ' ').toLowerCase();
}



function is_anything(v) {
  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  if (v === null)
    throw new Error("'null' found.");
  if (v === undefined)
    throw new Error("'undefined' found.");

  return true;
}

spec(is_function_name, ['is_function'], true);
spec(is_function_name, ['none none'], false);
spec(is_function_name, [is_function_name], false);
function is_function_name(v) {
  return is_string(v) && typeof v === 'function';
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

spec(is_blank_string, [""],     true);
spec(is_blank_string, ["   "],  true);
spec(is_blank_string, [" a  "], false);
function is_blank_string(v) {
  should_be(v, is_string);
  return length(_.trim(v)) < 1;
}


spec(split_on, [/;/, "a;b;c"], ['a', 'b', 'c']);
spec(split_on, [/;/, "a;b;c"], ['a', 'b', 'c']);
spec(split_on, [/;/, "a; ;c"], ['a', 'c']);
function split_on(pattern, str) {
  arguments_are(arguments, is_something, is_string);
  var trim = _.trim(str);
  if (is_empty(trim))
    return [];
  return _.compact( map_x(trim.split(pattern), function (x) {
    return !is_blank_string(x) && _.trim(x);
  }));
}


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

spec(is_null, [null], true);
spec(is_null, [undefined], false);
function is_null(v) {
  return v === null;
}

spec(is_undefined, [undefined], true);
spec(is_undefined, [null], false);
function is_undefined(v) {
  return v === undefined;
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
spec_throws(is_empty, [null],   'invalid value for is_empty: null');
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

spec(msg_match, [1,1], true);
spec(msg_match, ["a", "a"], true);
spec(msg_match, [[1],[1]], true);
spec(msg_match, [[1,[2]],[1,[2]]], true);
spec(msg_match, [{a:"b"}, {a:"b",c:"d"}], true);
spec(msg_match, [{a:is_string}, {a:"b"}], true);
spec(msg_match, [{}, {a:"b"}], false);
spec(msg_match, [{}, {}], true);
spec(msg_match, [[], []], true);
function msg_match(pattern, msg) {
  if (_.isEqual(pattern, msg))
    return true;

  if (is_plain_object(pattern) && is_plain_object(msg)) {
    if (is_empty(pattern) !== is_empty(msg))
      return false;

    return !_.detect(_.keys(pattern), function (key) {
      var target = pattern[key];
      if (msg[key] === target)
        return !true;
      if (is_function(target))
        return !should_be(target(msg[key]), is_bool);
      return !false;
    });
  }

  return false;
}

function do_it(num, func) {
  arguments_are(arguments, is_positive, is_function);
  for (var i = 0; i < num; i++) {
    func();
  }
  return true;
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


spec(name_to_function, ["name_to_function"], name_to_function);
function name_to_function(raw) {
  /* globals window, global */
  if (!is_string(raw))
    throw new Error('Not a string: ' + to_string(raw));
  var str = _.trim(raw);
  if (typeof str !== 'function')
    throw new Error('Function not found: ' + to_string(raw));
  return (typeof 'window' !== 'undefined') ? window[str] : global[str];
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
  var f = function __has_own_property(o) {
    return o.hasOwnProperty(name);
  };

  return set_function_string_name(f, arguments);
}


function is_specs(specs) {
  should_be(specs, is_plain_object);
  should_be(specs.list, not(is_empty));
  should_be(specs.i, or(is('init'), is(0), is_positive));
  should_be(specs.dones, is_plain_object);
  return true;
}


spec(function_to_name, ["function my_name() {}"], "my_name");
function function_to_name(f) {
  var WHITESPACE = /\s+/g;
  return f.to_string_name || f.toString().split('(')[0].split(WHITESPACE)[1] || f.toString();
}

spec(is_enumerable, [[]], true);
spec(is_enumerable, [{}], true);
spec(is_enumerable, [{}], true);
function is_enumerable(v) {
  return is_string(v) ||
  is_array(v)         ||
  is_plain_object(v)  ||
  _.isFinite(v.length) ||
    is_arguments(v);
}

spec(length,        [[1]], 1);
spec(length,        [function () {}], 0);
spec(length,        [function (a) { return a;}], 1);
spec(length,        [{length: 3}], 3);
spec_throws(length, [{}], 'invalid value for l(): {}');

function length(raw_v) {
  if (raw_v === null || raw_v === undefined || !_.isFinite(raw_v.length))
    throw new Error("Invalid value for length: " + to_string(raw_v));
  return raw_v.length;
}

spec_returns(true, function has_length_returns_function() {
  return is_function(has_length(1));
});
spec_returns(true, function has_length_returns_function_comparing_length() {
  return has_length(1)([1]);
});
spec_returns(true, function has_length_returns_function_comparing_length_of_function() {
  return has_length(2)(function (a,b) {});
});
spec_throws(function () { // returns function that returns false on length mismatch
  return has_length(3)([1,2]);
}, [], "[1, 2].length !== 3");
function has_length(num) {
  return function _has_length_(val) {
    arguments_are(arguments, is_something);
    if (val.length === num)
      return true;
    throw new Error(to_string(val) + '.length !== ' + to_string(num));
  };
}

spec(is_anything, [false], true);
spec(is_anything, [true], true);
spec_throws(is_anything, [null], 'null found');
spec_throws(is_anything, [undefined], 'undefined found');
function is_anything(v) {
  if (v === null)
    throw new Error('null found');
  if (typeof v === 'undefined')
    throw new Error('undefined found');
  return true;
}

spec(key_to_bool, ['time', {time: 'morning'}], true); // it 'returns true if key is "truthy"'
spec(key_to_bool, ['!time', {time: false}], true); // it 'returns true if: !key , key is !truthy'
spec(key_to_bool, ['!first.second.third', {first: {second: { third: true}}}], true); // it 'handles nested keys'
spec(key_to_bool, ['!!!first', {first: false}], true); // it 'handles multiple exclamation marks'
spec(key_to_bool, ['first', {}], undefined); // it 'returns undefined if one non-nested key is specified, but not found'
spec(key_to_bool, ['is_factor', {is_factor: true}], true);
spec(key_to_bool, ['!is_factor', {is_factor: false}], true);
spec(key_to_bool, ['is_factor', {is_ruby: false}], undefined);
spec(key_to_bool, ['is_happy', {is_happy: true}], true);
spec(key_to_bool, ['!is_happy', {is_happy: true}], false);
spec(key_to_bool, ['is_happy',  {is_happy: false}], false);
spec(key_to_bool, ['!is_happy', {is_happy: false}], true);
spec_throws(key_to_bool, [['is_factor'], {}], "Value: [\"is_factor\"] !== is_string");
function key_to_bool(raw_key, data) {
  var FRONT_BANGS = /^\!+/;

  var key        = _.trim(should_be(raw_key, is_string));
  var bang_match = key.match(FRONT_BANGS);
  var dots       = ( bang_match ? key.replace(bang_match[0], '') : key ).split('.');
  var keys       = _.map( dots, _.trim );

  var current = data;
  var ans  = false;

  _.detect(keys, function (key) {
    if (_.has(current, key)) {
      current = data[key];
      ans = !!current;
    } else {
      ans = undefined;
    }

    return !ans;
  });

  if (ans === undefined)
    return ans;

  if (bang_match) {
    _.times(bang_match[0].length, function () {
      ans = !ans;
    });
  }

  return ans;
} // === func


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
  var cols_length = length(args);

  return reduce_eachs_row_maker([init], 0, _.map(args, keys_or_indexes));

  function reduce_eachs_row_maker(row, col_i, key_cols) {
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

      reduce_eachs_row_maker(row, col_i, key_cols);

      row.pop();
      row.pop();
    }

    return row[0];
  }
} // === function: reduce_eachs


// TODO: spec :eachs does not alter inputs
spec_returns(
  ["01", "12"],
  function eachs_passes_key_and_val() {
    var v = [];
    eachs( [1,2], function (kx, x) { v.push("" + kx + x); });
    return v;
  }
);

spec_returns(
  ["1a", "1b", "2a", "2b"],
  function eachs_passes_vals_of_multiple_colls() {
    var v = [];
    eachs( [1,2], ["a", "b"], function (kx, x, ky, y) { v.push("" + x + y); });
    return v;
  }
);

spec_returns(
  ["onea", "twoa"],
  function eachs_passes_keys_and_vals_of_arrays_and_plain_objects() {
    var v = [];
    eachs({one: 1, two: 2}, ["a"], function (kx, x, ky, y) { v.push("" + kx + y); });
    return v;
  }
);
spec_returns(
  ["1a", "1b", "2a", "2b"],
  function eachs_passes_vals_of_plain_object_and_array() {
    var v = [];
    eachs({one: 1, two: 2}, ["a", "b"], function (kx, x, ky, y) { v.push("" + x + y); });
    return v;
  }
);
spec_returns( [],
  function eachs_returns_empty_array_if_one_array_is_empty() {
    var v = [];
    eachs({one: 1, two: 2}, [], ["a"], function (kx, x, ky, y, kz, z) {
      v.push("" + kx + y);
    });
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
  var cols_length = length(args);

  return eachs_row_maker([], 0, _.map(args, keys_or_indexes));

  function eachs_row_maker(row, col_i, key_cols) {
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

      eachs_row_maker(row, col_i, key_cols);

      row.pop();
      row.pop();
    }

    return;
  }
}

function map_x(coll, f) {
  should_be(coll, is_enumerable);
  should_be(f, is_function);
  return _.map(coll, function (x) { return f(x); });
}

function each_x(coll, f) {
  should_be(coll, is_enumerable);
  should_be(f, is_function);
  return eachs(coll, function (_i, x) {
    return f(x);
  });
}

spec_returns(true, function to_function_returns_sole_function() {
  var f = function () {};
  return to_function(f) === f;
});
spec_returns(2, function to_function_returns_an_identity_function() {
  return to_function(2)();
});
spec_returns('"3"', function to_function_returns_a_function() {
  return to_function(identity, to_string, to_string)(3);
});
function to_function() {
  if (arguments.length === 1) {
    if (is_function(arguments[0])) {
      return arguments[0];
    } else{
      var x = arguments[0];
      return function () { return x; };
    }
  }

  var i = 0, f;
  var l = arguments.length;
  while (i < l) {
    f = arguments[i];
    if (!_.isFunction(f))
      throw new Error('Not a function: ' + to_string(f));
    i = i + 1;
  }

  var funcs = arguments;
  return function () {
    var i = 0, f, val;
    while (i < l) {
      f = funcs[i];
      if (i === 0) {
        if (f.length !== arguments.length)
          throw new Error('Function.length ' + f.length + ' ' + to_string(f) + ' !=== arguments.length ' +  arguments.length + ' ' + to_string(arguments));
        val = apply_function(f, arguments);
      } else {
        if (f.length !== 1)
          throw new Error('Function.length ' + f.length + ' !=== 1');
        val = apply_function(f, [val]);
      }
      i = i + 1;
    }
    return val;
  }; // return
}

spec_returns('"4"', function to_value_returns_a_value() {
  return to_value(4, to_string, to_string);
});
spec_returns(5, function to_value_returns_first_value_if_no_funcs() {
  return to_value(5);
});
function to_value(val, _funcs) {
  should_be(val, is_something);
  should_be(arguments, not(is_empty));

  var i = 1, l = arguments.length;
  while (i < l) {
    val = arguments[i](val);
    i = i + 1;
  }
  return val;
}

spec_returns(false, function () { // next_id returns a different value than previous
  return next_id() === next_id();
});
function next_id() {
  if (!is_num(next_id.count))
    next_id.count = -1;
  next_id.count = next_id.count + 1;
  if (is_empty(arguments))
    return next_id.count;
  return arguments[0] + '_' + next_id.count;
}



function sort_by_length(arr) {
  return arr.sort(function (a,b) {
    return length(a) - length(b);
  });
}


function replace(pattern, new_value) {
  if (length(arguments) === 3) {
    return arguments[2].replace(arguments[0], arguments[1]);
  }

  return function (v) {
    return v.replace(pattern, new_value);
  };
}

function and(_funcs) {
  var funcs = _.toArray(arguments);
  return function (v) {
    for (var i = 0; i < length(funcs); i++) {
      if (!funcs[i](v)) return false;
    }
    return true;
  };
}

spec(be, [1, is_num], 1);
spec(be, [1, is_num, is_something], 1);
spec(be, ['1', is_num], new Error('Value: "1" !== is_num'));
spec(be, [2, is_num, is_null], new Error('Value: 2 !== is_null'));
function be() {
  var funcs = _.toArray(arguments);
  return function (v) {
    for (var i = 0; i < length(funcs); i++) {
      if (!funcs[i](v))
        throw new Error(to_string(v) + ' should be: ' + to_string(funcs[i]));
    }
    return v;
  };
}

function reduce(value, _functions) {
  var funcs = _.toArray(arguments);
  var v     = funcs.shift();
  return _.reduce(funcs, function (acc, f) { return f(acc); }, v);
}

function find(_funcs) {
  var funcs = _.toArray(arguments);
  return function (v) {
    return _.find(v, and.apply(null, funcs));
  };
}

function not(func) {
  reduce(arguments, length, be(is(1)));
  return function (v) {
    var result = be(is_boolean)(func(v));
    return !result;
  };
}

function all(_funcs) {
  var _and = and.apply(null, arguments);
  return function (arr) {
    for(var i = 0; i < length(arr); i++){
      if (!_and(arr[i]))
        return false;
    }
    return true;
  };
}

function combine(_vals) {
  var vals = _.toArray(arguments);
  if (all(is_plain_object)(vals)) {
    return _.extend.apply(null, [{}].concat(vals));
  }
  if (all(is_array)(vals))
    return [].concat(vals);
  throw new Error("Only Array of Arrays or Plain Objects allowed: " + to_string(arguments));
}

spec(function_to_name, ["function my_name() {}"], "my_name");
function function_to_name(f) {
var WHITESPACE = /\s+/g;
  return f.to_string_name || f.toString().split('(')[0].split(WHITESPACE)[1] || f.toString();
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

function wait_max(seconds, func) {
  var ms = seconds * 1000;
  var total = 0;
  var interval = 100;
  function reloop() {
    total = total + interval;
    if (func())
      return true;
    if (total > ms)
      throw new Error('Timeout exceeded: ' + to_string(func) );
    else
      setTimeout(reloop, interval);
  }
  setTimeout(reloop, interval);
}
