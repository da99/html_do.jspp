"use strict";

var Dum_Dum_Boom_Boom = function () {};

Dum_Dum_Boom_Boom.Designs = [];
Dum_Dum_Boom_Boom.push = function (f) {
  Dum_Dum_Boom_Boom.Designs.push(f);
  return Dum_Dum_Boom_Boom;
};

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

  if (or(is(0), is_positive)(val.length) && val.callee)
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

function is(target) { return function (v) { return v === target; }; }

function is_positive(v) { return typeof v === 'number' && isFinite(v) && v > 0; }


function is_$(v) {
  return v && typeof v.html === 'function' && typeof v.attr === 'function';
}

var to_arg = function (val) { return function (f) { return f(val); }; };

var run_specs = function (_funcs) {
  var do_it = _.all(arguments, function (v) {
    return (_.isBoolean(v) && v) || (_.isFunction(v) && v());
  });

  if (!do_it)
    return false;

  var counts = [];

  _.each(Dum_Dum_Boom_Boom.Designs, function (d) {
    _.each(d.example, function (args) {
      log("=== spec: " + to_string(args));
      d.f.apply(null, args);
      counts.push(1);
    });
  });

  if (_.isEmpty(counts))
    throw new Error("!!! No specs found.");

  log("=== PASSED");
  return true;
}; // === func


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

function is_null_or_underfined(v) {
  return v === null || v === undefined;
}

function spec(f, args, output, err_msg) {
  if (!is_localhost())
    return false;

  var args_3 = arguments.length === 3;
  var args_4 = arguments.length === 4;
  var is_throw = output === 'throws' && args_4;

  var name = f.toString().split('(')[0].split(' ').pop();
  if (!(args_3 || args_4))
    throw new Error("arguments.length !== 3 for spec: " + name);

  if (args_4 && output !== 'throws')
    throw new Error("Invalid value for output: " + output);

  var sig = name + '(' + _.map(args, to_string).join(', ') + ') -> ' + output + (err_msg ? ' \'' + err_msg + '\'' : '');

  if (!is_throw) {
    if (f.apply(null, args) !== output)
      throw new Error("!!! Failed: " + sig );
    log('=== Passed: ' + sig);
    return true;
  }

  var err = null;
  try {
    f.apply(null, args);
  } catch (e) {
    err = e;
  }

  if (!err)
    throw new Error('!!! Failed to throw error: ' + sig);

  if (err.message === err_msg) {
    log('=== Passed: ' + sig);
    return true;
  }

  log('!!! Unexpected error for: ' + sig);
  throw err;
}

spec(name_of_function, ["function my_name() {}"], "my_name");
function name_of_function(f) {
  var name = f.toString().split('(')[0].split(' ')[1];
  return name || f.toString();
}

spec(l, [[1]], 1);
spec(l, [{}], 'throws', '.length is [object Object].undefined');
function l(v) {
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
spec(is_anything, [null], 'throws', 'null found');
spec(is_anything, [undefined], 'throws', 'undefined found');
function is_anything(v) {
  if (v === null)
    throw new Error('null found');
  if (typeof v === 'undefined')
    throw new Error('undefined found');
  return true;
}


// ============================================================================

log(l( $('p') ));
log(l( $("p")) );

// run_specs(is_localhost);
log("THE_FILE_DATE");


