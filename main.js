"use strict";

var Dum_Dum_Boom_Boom = function () {};

Dum_Dum_Boom_Boom.Designs = [];
Dum_Dum_Boom_Boom.push = function (f) {
  Dum_Dum_Boom_Boom.Designs.push(f);
  return Dum_Dum_Boom_Boom;
};

var is_localhost = function () {
  var addr = window.location.href;
  return addr.indexOf("localhost") > -1 ||
    addr.indexOf("file:///") > -1 ||
    addr.indexOf("127.0.0.1") > -1
    ;
}; // === func

var log = function (_args) {
  if (is_localhost)
    return console.log.apply(console, arguments);

  return this;
}; // === func


var i = function (_args) {
  _.each(arguments, function (f) {
    if (!f.is_dum && !f.is_deadly_dum)
      throw new Error("Not a dum func: " + f.toString());
  });

  return {type: "input",   args: arguments};
};

var args = function (_args) {
  _.each(arguments, function (f) {
    if (!is_dum(f))
      throw new Error("Not a dum func: " + f.toString());
  });
  return {type: "arguments", args: arguments};
};

var o = function (_args) {
  _.each(arguments, function (f) {
    if (!is_dum(f))
      throw new Error("Not a dum func: " + f.toString());
  });

  return {type: "output",  args: arguments};
};

var e = function (_args) {
  if (arguments.length === 0)
    throw new Error("e() called w/o args.");
  _.each(arguments, function (v) {
    if (v === undefined)
      throw new Error("'undefined' found.");
    if (v === null)
      throw new Error("'null' found.");
  });

  return {type: "example", args: arguments};
};


var is_dum   = function (f) { return typeof f === 'function' && (f.is_dum || f.is_deadly_dum); };
var deadly_f = function (f) { f.is_deadly_dum = true; return f; };

var f = function () {
  var  example = [];
  var  input   = [];
  var  output  = [];
  var  f       = null;
  var  fin     = null;

  var arg_l = arguments.length;
  var i     = 0;
  var a     = null;
  while (i < arg_l) {
    a = arguments[i];

    switch (typeof a) {
      case "function":
        f = a;
        break;

      default:
        switch (a.type) {
          case "example":
            example = _.clone(example);
            example.push(_.toArray(a.args));
            break;

          case "input":
            input = _.clone(input);
            input.push(_.toArray(a.args));
            break;

          case "output":
            if (output.length !== 0)
              throw new Error("Output already defined.");
            output = _.toArray(a.args);
            break;

          default:
            throw new Error("Input type: " + a.type);
        } // === switch a.type
    } // === switch typeof a
    i = i + 1;
  } // === while


  // ===============
  if (example.length === 0)
    throw new Error('!!! No :example spec specified.');

  if (output.length === 0)
    throw new Error('!!! No :output spec specified.');

  _.each(input, function (arr) {
    if (!_.isArray(arr))
      throw new Error('!!! Not an array: ' + arr);

    _.each(arr, function (func) {
     if (!_.isFunction(func))
      throw new Error('!!! Not a function: ' + func);
    });
  });

  if (!_.isFunction(f))
    throw new Error('Not a function: ' + f);

  fin = function () {
    _.each(arguments, function (v, i) {
      if (v === null)
        throw new Error("Argument is 'null'. Position: " + i);
      if (v === undefined)
        throw new Error("Argument is 'undefined'. Position: " + i);
    });

    if (input.length !== f.length)
      throw new Error("Argument length mismatch: " + input.length + ' !== ' + f.length);

    // Validate inputs:
    _.all(arguments, function (arg, i) {
      if (!_.all(input[i], function (f) { return f(arg); }))
        throw new Error("Invalid inputs: " + arg + " for: " + f);
    });

    var val = f.apply(null, arguments);

    // Validate output:
    if (!_.all(output, function (f) { return f(val); }))
      throw new Error("Invalid output: " + val);

    return val;
  };
  fin.is_dum = true;

  Dum_Dum_Boom_Boom.push({input: input, output: output, example: example, f: f, fin: fin});

  return fin;
}; // === func f

var is_array_of_functions = function (a) {
  return _.isArray(a) && _.all(a, _.isFunction);
}; // === func

function is_zero(v) { return v === 0; }
deadly_f(is_zero);

function is_pos_int(v) { return _.isFinite(v) && v > 0; }
deadly_f(is_pos_int);


function is_$(v) {
  return v &&
    typeof v.html === 'function' &&
      typeof v.attr === 'function';
}

deadly_f(is_$);

var to_string = function (val) {
  if (val === null)
    return "null";

  if (val === undefined)
    return "undefined";

  if (_.isArray(val))
    return  '['+_.map(val, to_string).join(", ") + ']';

  if (_.isString(val))
    return '"' + val + '"';

  if (or(is_zero, is_pos_int)(val.length) && val.callee)
    return to_string(_.toArray(val));

  return val.toString();
}; // === func

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

deadly_f(is_anything);
function is_anything(v) {
  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  if (v === null)
    throw new Error("'null' found.");
  if (v === undefined)
    throw new Error("'undefined' found.");

  return true;
}

deadly_f(is_function);
function is_function(v) {
  if (arguments.length !== 1)
    throw new Error("Invalid: arguments.length must === 1");
  return typeof v === 'function';
}

deadly_f(conditional);
function conditional(name, funcs) {
  if (funcs.length < 2)
    throw new Error("Called 'or' with few arguments: " + arguments.length);
  _.each(funcs, function (v) {
    if (!is_dum(v))
      throw new Error("Not a dum function: " + v.toString());
  });

  if (!_[name])
    throw new Error("_." + name + " does not exist.");

  return deadly_f(function (v) {
    return _[name](funcs, function (f) { return f(v); });
  });
}

function and(_funcs) {
  return conditional('all', arguments);
}

function or(_funcs) {
  return conditional('any', arguments);
}

var length_of = f(
  e(4),
  i(or(is_zero, is_pos_int)),
  o(is_function),
  function (num) {
    return f(
      e([]), e("----"),
      i(or(is_array, is_string)),
      o(is_bool),
      function (v) { return v.length === num; }
    );
  }
);

var length_gt = f(
  e(0),
  i(or(is_zero, is_pos_int)),
  o(is_function),
  function (num) {
    return f(
      e(0),
      i(or(is_zero, is_pos_int)),
      o(is_bool),
      function (v) { return v.length > num;}
    );
  }
);

var is_string = deadly_f(function (v) { return typeof v === "string"; });
var is_array  = deadly_f(_.isArray);
var is_bool   = deadly_f(_.isBoolean);


var is_empty = function (v) {
  var l = v.length;
  if (!_.isFinite(l))
    throw new Error("!!! Invalid .length property.");

  return l === 0;
}; // === func


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
  i(is_anything),
  o(length_gt(0)),
  function (v) {
    return dom(v);
  }
);

log(l( dom('p') ));
log(l( dom($("p")) ));

run_specs(is_localhost);
log("THE_FILE_DATE");


