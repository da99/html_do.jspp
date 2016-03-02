/* jshint node: true, esnext: true, strict: true, undef: true */
var dum_dum = require('../build/node');
var _       = require('lodash');

dum_dum.log('=== Running specs for node.js:');

if (typeof dum_dum !== 'object')
  throw new Error("dum_dum is not an object.");

if (_.keys(dum_dum).length < 10)
  throw new Error("node.js export is empty.");

_.each(_.keys(dum_dum), function (k) {
  "use strict";

  if (dum_dum[k] === null || dum_dum[k] === undefined)
    throw new Error(k + ' is ' + typeof(k));
  // log(k + ' export: ' + typeof(dum_dum[k]));
});

dum_dum.log("=== Passed: functions were exported.");
dum_dum.spec('run');
