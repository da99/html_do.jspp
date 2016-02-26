"use strict";
/* jshint esnext: true, globalstrict: true, undef: true */
/* global _ : true, console, require, process  */

const WHITESPACE = /\s+/g;
const _          = require('lodash');
const fs         = require('fs');
const util       = require('util');
const path       = require('path');


function spec_push(f) {
  if (!spec_push.specs) spec_push.specs = [];
  spec_push.specs.push(f);
  return true;
}

function spec_run() {
  let specs = (spec_push.specs || []);
  log('=== Running specs: ');
  for (var i = 0; i < specs.length; i++) {
    specs[i]();
  }
  if (specs.length === 0)
    throw new Error('No specs found.');
}

function spec(_args) {
  let f, args, expect;

  if (arguments.length === 3) {
    f      = arguments[0];
    args   = arguments[1];
    expect = arguments[2];

    return spec_push(function () {
      var sig    = to_function_string(f, args);
      var actual = f.apply(null, args);
      var msg    = to_match_string(actual, expect);

      if (actual !== expect && !_.isEqual(actual, expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg );

      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    });
  }

  if (arguments.length === 2) {
    expect = arguments[0];
    f = arguments[1];

    return spec_push(function () {
      var sig = function_to_name(f);
      var actual = f();
      var msg = to_match_string(actual, expect);
      if (!_.isEqual(actual,expect))
        throw new Error("!!! Failed: " + sig + ' -> ' + msg);
      log('=== Passed: ' + sig + ' -> ' + msg);
      return true;
    });
  }
} // === function spec

function log(_args) {
  return console.log.apply(console, arguments);
}

function log_and_return(v) {
  log(v);
  return v;
}

spec(to_string, [undefined], "undefined");
spec(to_string, [null],      "null");
function to_string(v) {
  if (v === undefined) return 'undefined';
  if (v === null)      return 'null';
  if (v === false)     return 'false';
  if (v === true)      return 'true';

  if (_.isFunction(v))
    return (v.name) ? v.name + ' (function)' : v.toString();

  if (_.isString(v))
    return '"' + v + '"';

  if (_.isArray(v))
    return '[' + _.map(_.toArray(v), to_string).join(', ') + '] (Array)';

  if (v.constructor === arguments.constructor)
    return '[' + _.map(_.toArray(v), to_string).join(', ') + '] (arguments)';

  return util.inspect(v);
}

function is_whitespace(v) { return is_string(v) && length(_.trim(v)) === 0; }
function is(target) { return function (val) { return val === target; }; }
function is_boolean(v) { return typeof v === 'boolean'; }
function is_string(v) { return typeof v === "string"; }
function is_length_zero(v) { return length(v) === 0;  }
function is_dir(v) { try { return fs.lstatSync(v).isDirectory(); } catch (e) { return false; } }
function is_file(v) { try { return fs.lstatSync(v).isFile(); } catch (e) { return false; } }
function is_blank_string(str) { return _.trim(str).length === 0; }
function identity(v) { return v; }
function is_null_or_undefined(v) { return v === null || v === undefined; }
function is_something(v) { return !is_null_or_undefined(v); }
function is_partial($) { return $('html').length === 0; }
function is_array(v) { return _.isArray(v); }
function is_plain_object(v) { return _.isPlainObject(v); }
function is_true(v) { return v === true; }

function sort_by_length(arr) {
  return arr.sort(function (a,b) {
    return length(a) - length(b);
  });
}

function is_empty(v) {
  if (is_array(v))
    return v.length === 0;
  if (is_plain_object(v))
    return _.keys(v).length === 0;
  if (v.hasOwnProperty('length') && _.isFinite(v.length))
    return v.length === 0;

  console.error("!!! Unknown .length for: " + to_string(v));
  process.exit(1);
}

function length(raw_v) {
  if (raw_v === null || raw_v === undefined || !_.isFinite(raw_v.length))
    throw new Error("Invalid value for length: " + to_string(raw_v));
  return raw_v.length;
}


function to_default(valid) {
  if (length(arguments) === 2) {
    let v = arguments[1];
    if (v === null || v === undefined)
      return valid;
    return v;
  }

  return function (v) { return to_default(valid, v); };
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
  let funcs = _.toArray(arguments);
  return function (v) {
    for (var i = 0; i < length(funcs); i++) {
      if (!funcs[i](v)) return false;
    }
    return true;
  };
}

function be() {
  let funcs = _.toArray(arguments);
  return function (v) {
    for (var i = 0; i < length(funcs); i++) {
      if (!funcs[i](v))
        throw new Error(to_string(v) + ' should be: ' + to_string(funcs[i]));
    }
    return v;
  };
}

function reduce(value, _functions) {
  let funcs = _.toArray(arguments);
  let v     = funcs.shift();
  return _.reduce(funcs, function (acc, f) { return f(acc); }, v);
}

function find(_funcs) {
  let funcs = _.toArray(arguments);
  return function (v) {
    return _.find(v, and.apply(null, funcs));
  };
}

function not(func) {
  reduce(arguments, length, be(is(1)));
  return function (v) {
    let result = be(is_boolean)(func(v));
    return !result;
  };
}

function all(_funcs) {
  let _and = and.apply(null, arguments);
  return function (arr) {
    for(var i = 0; i < length(arr); i++){
      if (!_and(arr[i]))
        return false;
    }
    return true;
  };
}

function combine(_vals) {
  let vals = _.toArray(arguments);
  if (all(is_plain_object)(vals)) {
    return _.extend.apply(null, [{}].concat(vals));
  }
  if (all(is_array)(vals))
    return [].concat(vals);
  throw new Error("Only Array of Arrays or Plain Objects allowed: " + to_string(arguments));
}

spec(function_to_name, ["function my_name() {}"], "my_name");
function function_to_name(f) {
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

if(process.argv[2] === 'test')
  spec_run();
