"use strict";
/* jshint esnext: true, globalstrict: true, undef: true */
/* global console, require, process  */

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

function is_dir(v) { try { return fs.lstatSync(v).isDirectory(); } catch (e) { return false; } }
function is_file(v) { try { return fs.lstatSync(v).isFile(); } catch (e) { return false; } }


if(process.argv[2] === 'test')
  spec_run();
