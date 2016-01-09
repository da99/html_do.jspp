"use strict";

var Dum_Dum_Funcs = [];

function Dum_Dum_Boom_Boom_Run(args, ins, out, func) {
  if (ins.length !== func.length)
    throw new Error("Argument length mismatch: " + ins.length + ' !== ' + func.length);

  // Validate inputs:
  var inputs_valid = _.all(args, function (arg, i) {
    return _.all(ins[i], function (is_valid) { return is_valid(arg); });
  });

  if (!inputs_valid)
    throw new Error("Invalid inputs: " + to_string(_.toArray(args)));

  var val = func.apply(null, args);

  var is_valid = _.all(out, function (f){ return f(val); });
  if (!is_valid)
    throw new Error("Invalid output: " + to_string(val));

  return val;
}

function Dum_Dum_Boom_Boom() {
  var dum   = this;
  var ins   = [];
  var out   = [];

  this.exs = [];

  this.example = function () {
    dum.exs.push(_.toArray(arguments));
    return dum;
  }; // === func

  this.in   = function () {
    ins.push(_.toArray(arguments));
    return dum;
  };

  this.out  = function () {
    if (!_.all(arguments, _.isFunction))
      throw new Error("Not all functions: " + to_string(arguments));

    out = _.toArray(arguments);
    return dum;
  };

  this.body = function (func) {
    if (dum.exs.length === 0)
      throw new Error('!!! No examples specified.');

    if (!_.isFunction(func))
      throw new Error('Not a function: ' + to_string(func));
    var f = function () {
      return Dum_Dum_Boom_Boom_Run(arguments, ins, out, func);
    };

    if (out.length === 0)
      throw new Error('!!! No :out spec specified.');

    f.design = dum;
    Dum_Dum_Funcs = [].concat(Dum_Dum_Funcs).concat([f]);
    return f;
  };

  return this;
} // === func Dum_Dum_Boom_Boom

var Dum_Dum_Boom_Boom_Run_Specs = function (_funcs) {
  var do_it = _.all(arguments, function (v) {
    return (_.isBoolean(v) && v) || (_.isFunction(v) && v());
  });

  if (!do_it)
    return false;

  _.each(Dum_Dum_Funcs, function (f) {
    var d = f.design;
    _.each(d.exs, function (args) {
      log("=== spec: " + to_string(args));
      f.apply(null, args);
    });
  });

  log("=== PASSED");
  return true;
}; // === func


// === Helpers ===================================================================


var log = function (_args) {
  if (is_localhost)
    return console.log.apply(console, arguments);

  return this;
}; // === func


var length_of = (new Dum_Dum_Boom_Boom())
.example(4)
.in(_.isFinite)
.out(_.isFunction)
.body(function (num) {
  return function (v) { return v.length === num; };
});

var length_gt = (new Dum_Dum_Boom_Boom())
.base(length_of)
.body(function (num) {
  return function (v) { return v.length > num;};
});

var is_string = (new Dum_Dum_Boom_Boom())
.example("v")
.in(_.isString)
.out(_.isBoolean)
.body(
  function (v)   { return typeof v === "string"; }
);


var all = (new Dum_Dum_Boom_Boom())
.example(_.isString)
.in(_.isFunction)
.out(_.isFunction)
.body(
  function (f) {
    return (new Dum_Dum_Boom_Boom())
    .example([])
    .in(_.isArray)
    .out(_.isBoolean)
    .body(function (arr) {
      return _.all(arr, f);
    });
  }
);

var to_string = function (val) {
  if (val === null)
    return "null";

  if (val === undefined)
    return "undefined";

  if (_.isArray(val))
    return  '['+_.map(val, to_string).join(", ") + ']';

  if (_.isString(val))
    return '"' + val + '"';

  if (_.isFinite(val.length) && val.callee)
    return to_string(_.toArray(val));

  return val.toString();
}; // === func

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

var or = function () {
  var funcs = arguments;
  return function (arg) {
    return _.any(funcs, function (f) { return f(arg); });
  };
};

var all_funcs = function (arr) {
  var l = arr.length;
  return _.isFinite(l) && l > 0 && _.all(arr, _.isFunction);
};

var is_$ = function (v) {
  return v &&
    typeof v.html === 'function' &&
      typeof v.attr === 'function';
};

var l            = function (v) {
  if (!_.isFinite(v.length))
    throw new Error("No valid .length property: " + to_string(v));
  return v.length;
};


var dom = (new Dum_Dum_Boom_Boom())
.example("p")
.example("body")
.example(jQuery("body"))
.in(or(is_string, is_$))
.out(is_$)
.body(function (s) { return jQuery(s); })
;

var non_empty_$ = (new Dum_Dum_Boom_Boom())
.example("body")
.in(anything)
.out(length_gt(0))
.body(function (v) {
  return dom(v);
})
;

log(l( dom('p') ));
log(l( dom($("p")) ));

Dum_Dum_Boom_Boom_Run_Specs(is_localhost);
log("THE_FILE_DATE");


