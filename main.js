"use strict";

var Dum_Dum_Boom_Boom = function () {};

Dum_Dum_Boom_Boom.Designs = [];
Dum_Dum_Boom_Boom.push = function (f) {
  Dum_Dum_Boom_Boom.Designs.push(f);
  return Dum_Dum_Boom_Boom;
};

var is_array_of_functions = function (a) {
  return _.isArray(a) && _.all(a, _.isFunction);
}; // === func

var is_function = function (f) { return typeof f === 'function'; };
var is_zero     = function (v) { return v === 0; };
var is_pos_int  = function (v) { return _.isFinite(v) && v > 0; }; // === func
var is_$ = function (v) {
  return v &&
    typeof v.html === 'function' &&
      typeof v.attr === 'function';
};
var to_string = function (val) {
  if (val === null)
    return "null";

  if (val === undefined)
    return "undefined";

  if (_.isArray(val))
    return  '['+_.map(val, to_string).join(", ") + ']';

  if (_.isString(val))
    return '"' + val + '"';

  if (is(val.length, or(is_zero, is_pos_int)) && val.callee)
    return to_string(_.toArray(val));

  return val.toString();
}; // === func
var to_arg = function (val) { return function (f) { return f(val); }; };
var i = function (_args) { return {type: "input",   args: arguments}; };
var o = function (_args) { return {type: "output",  args: arguments}; };
var e = function (_args) { return {type: "example", args: arguments}; };

var f = function () {
  var design = {
    example : [],
    input   : [],
    output  : [],
    f       : null,
    fin     : null
  };

  var arg_l = arguments.length;
  var i     = 0;
  var a     = null;
  while (i < arg_l) {
    a = arguments[i];

    switch (typeof a) {
      case "function":
        design.f = a;
        break;

      default:
        switch (a.type) {
          case "output":
            design[a.type] = [].concat(design[a.type]).concat(_.toArray(a.args));
          break;

          default:
            design[a.type].push(_.toArray(a.args));
        } // === switch a.type
    } // === switch typeof a
    i = i + 1;
  } // === while


  // ===============
  if (_.isEmpty(design.example))
    throw new Error('!!! No examples specified.');

  if (_.isEmpty(design.output))
    throw new Error('!!! No :out spec specified.');

  if (!_.all(design.input, is_array_of_functions))
    throw new Error('!!! Not a function: ' + to_string(design.input));

  if (!is_array_of_functions(design.output))
    throw new Error('!!! Not an array of functions: ' + to_string(design.output));

  if (!_.isFunction(design.f))
    throw new Error('Not a function: ' + to_string(design.f));

  design.fin = function () {
    var i = design.input;
    var f = design.f;
    var o = design.output;

    if (i.length !== f.length)
      throw new Error("Argument length mismatch: " + i.length + ' !== ' + f.length);

    // Validate inputs:
    _.all(arguments, function (arg, i) {
      if (!_.all(i[i], to_arg(arg)))
        throw new Error("Invalid inputs: " + to_string(arg) + " for: " + to_string(f));
    });

    var val = f.apply(null, arguments);

    // Validate output:
    if (!_.all(o, to_arg(val)))
      throw new Error("Invalid output: " + to_string(val));

    return val;
  };

  Dum_Dum_Boom_Boom.push(design);

  return design.fin;
}; // === func f

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

var or = function () {
  var funcs = arguments;
  return function (arg) {
    return _.any(funcs, function (f) { return f(arg); });
  };
};

var is = function (x, _funcs) {
  var args  = _.toArray(arguments);
  x         = args.shift();
  var funcs = args;
  if (_.isEmpty(funcs))
    throw new Error("No functions specified.");
  return _.all(funcs, to_arg(x));
};

var log = function (_args) {
  if (is_localhost)
    return console.log.apply(console, arguments);

  return this;
}; // === func


var length_of = f(
  e(4),
  i(or(is_zero, is_pos_int)),
  o(is_function),
  function (num) {
    return function (v) { return v.length === num; };
  }
);

var length_gt = f(
  e(0),
  i(or(is_zero, is_pos_int)),
  o(is_function),
  function (num) {
    return function (v) { return v.length > num;};
  }
);

var is_string = function (v) { return typeof v === "string"; };
var is_array  = _.isArray;
var is_bool   = _.isBoolean;


var is_empty = function (v) {
  var l = v.length;
  if (!_.isFinite(l))
    throw new Error("!!! Invalid .length property.");

  return l === 0;
}; // === func

var is_localhost = function () {
  var addr = window.location.href;
  return addr.indexOf("localhost") > -1 ||
    addr.indexOf("file:///") > -1 ||
    addr.indexOf("127.0.0.1") > -1
    ;
}; // === func

var anything = function () { return true; };

var all_funcs = function (arr) {
  var l = arr.length;
  return _.isFinite(l) && l > 0 && _.all(arr, _.isFunction);
};


var l            = function (v) {
  if (!_.isFinite(v.length))
    throw new Error("No valid .length property: " + to_string(v));
  return v.length;
};


var dom = f(
  e("p"), e("body"), e(jQuery("body")),
  i(or(is_string, is_$)),
  o(is_$),
  function (s) { return jQuery(s); }
);

var non_empty_$ = f(
  e("body"),
  i(anything),
  o(length_gt(0)),
  function (v) {
    return dom(v);
  }
);

log(l( dom('p') ));
log(l( dom($("p")) ));

run_specs(is_localhost);
log("THE_FILE_DATE");


