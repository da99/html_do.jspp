"use strict";
/* jshint evil : true, esnext: true, globalstrict: true, undef: true */
/* global $ : true, _ : true, console, require, process  */

const cheerio = require('cheerio');
const _       = require('lodash');
const fs      = require('fs');
const path    = require('path');
const he      = require('he');

var args = process.argv.slice(2);
var layout = args.shift();
var file   = args.shift();

var layout_contents = fs.readFileSync(layout);
var file_contents   = fs.readFileSync(file);

var $layout = cheerio.load(layout_contents);
var $file   = cheerio.load(file_contents);

_.each($file.children(), function (raw) {
  switch (raw.name) {
    case 'head':
      $layout('head').append($file(raw).html());
      $file(raw).remove();
      break;

    case 'tail':
      $layout('body').after($file(raw).html());
      $file(raw).remove();
      break;

    case 'top':
      $layout('body').prepend($file(raw).html());
      $file(raw).remove();
      break;

    case 'bottom':
      $layout('body').append($file(raw).html());
      $file(raw).remove();
      break;
  } // == switch
});

_.each($layout('file'), function (raw) {
  if (_.isEmpty($layout(raw).attr())) {
    $layout(raw).replace($file);
    return true;
  }
});

var fin = process_file_tags($layout);
log(fin.html());

function log(_args) {
  return console.log.apply(console, arguments);
}

function process_file_tags($) {
  var tags = $('file');
  if (tags.length === 0)
    return $;
  _.each(tags, function (raw) {
    var src = _.trim($(raw).attr('src') || '');
    if (_.isEmpty(src)) {
      console.error('!!! No src for file tags');
      process.exit(1);
    }
    var new$ = cheerio.load(fs.readFileSync(src));
    $(raw).replace(new$);
  });

  return process_file_tags(4);
}

