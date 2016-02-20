"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

const cheerio = require('cheerio');
const _       = require('lodash');
const fs      = require('fs');
const path    = require('path');
const he      = require('he');

var args = process.argv.slice(2);
var file = args.shift();
var dir  = args.shift() || path.dirname(file);

var contents = fs.readFileSync(file).toString();
var $ = cheerio.load(contents);

section_to_file('script', $, dir + '/script.js');
section_to_file('head', $, dir + '/head.html');
section_to_file('style', $, dir + '/style.css');
fs.writeFileSync(dir + '/markup.html', $.html());


function log(_args) {
  return console.log.apply(console, arguments);
}

function section_to_file(tag, $, file_path) {
  var targets = $(tag);

  if (targets.length === 0)
    return false;

  if (targets.length > 1) {
    console.error("!!! Too many tags for: " + tag);
    process.exit(1);
  }

  var target = targets[0];
  var contents = $(target).html();
  $(target).remove();
  fs.writeFileSync(file_path, contents);
  return true;
}
