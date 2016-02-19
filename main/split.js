"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

const cheerio = require('cheerio');
const _       = require('lodash');
const fs      = require('fs');
const path    = require('path');
const he      = require('he');

var files = _.uniq(_.compact(_.map(process.argv, function (file) {
  if (file.indexOf('.html') > 0)
    return file;
})));

log(files);


function log(_args) {
  return console.log.apply(console, arguments);
}
