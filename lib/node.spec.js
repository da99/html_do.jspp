/* jshint node: true, esnext: true, strict: true, undef: true */
var dum_dum = require('../build/node');
var _       = require('lodash');

if (typeof dum_dum !== 'object')
  throw new Error("dum_dum is not an object.");

if (_.keys(dum_dum).length < 10)
  throw new Error("node.js export is empty.");
